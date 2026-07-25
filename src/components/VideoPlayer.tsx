import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';
import { 
  Volume2, VolumeX, Maximize2, Minimize2, 
  Radio, RefreshCw, Tv, Wifi, Zap, ChevronDown, Check
} from 'lucide-react';
import { Channel, StreamQuality } from '../types';

interface Props {
  channel: Channel;
}

export const VideoPlayer: React.FC<Props> = ({ channel }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.8);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isControlsVisible, setIsControlsVisible] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Quality & Internet speed control
  const [availableQualities, setAvailableQualities] = useState<StreamQuality[]>([]);
  const [selectedQualityIndex, setSelectedQualityIndex] = useState<number>(-1); // -1 = Auto
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState<boolean>(false);
  const [isDataSaver, setIsDataSaver] = useState<boolean>(false);
  const hlsRef = useRef<Hls | null>(null);

  // Player mode
  const [currentMirror, setCurrentMirror] = useState<'primary' | 'backup' | 'embed'>('primary');
  const [isIframeMode, setIsIframeMode] = useState<boolean>(channel.streamType === 'iframe' || false);

  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stallTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to format embed URLs
  const getEmbedUrl = (ch: Channel) => {
    const target = ch.embedUrl || ch.url;
    if (target.includes('youtube.com') || target.includes('youtu.be')) {
      let videoId = '';
      if (target.includes('v=')) {
        videoId = target.split('v=')[1]?.split('&')[0] || '';
      } else if (target.includes('youtu.be/')) {
        videoId = target.split('youtu.be/')[1]?.split('?')[0] || '';
      } else if (target.includes('/embed/')) {
        videoId = target.split('/embed/')[1]?.split('?')[0] || '';
      }
      if (videoId) {
        return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=0&enablejsapi=1&controls=1&modestbranding=1`;
      }
    }
    return target;
  };

  // Reset states on channel change
  useEffect(() => {
    setCurrentMirror('primary');
    setIsIframeMode(channel.streamType === 'iframe');
    setHasError(false);
  }, [channel.id, channel.streamType]);

  // Silent failover logic
  const handleSilentFailover = useCallback(() => {
    if (currentMirror === 'primary' && channel.backupUrl) {
      console.log('[manibuTV] Primary stream unavailable, trying backup stream...');
      setCurrentMirror('backup');
      setIsIframeMode(false);
    } else if (currentMirror !== 'embed' && channel.embedUrl) {
      console.log('[manibuTV] Stream unavailable, trying web live embed URL...');
      setCurrentMirror('embed');
      setIsIframeMode(true);
      setIsLoading(false);
      setHasError(false);
    } else {
      console.log('[manibuTV] Live stream offline.');
      setIsLoading(false);
      setHasError(true);
    }
  }, [currentMirror, channel.backupUrl, channel.embedUrl]);

  // Load HLS Stream
  useEffect(() => {
    if (isIframeMode || currentMirror === 'embed') {
      setIsIframeMode(true);
      setIsLoading(false);
      setHasError(false);
      return;
    }

    const video = videoRef.current;
    if (!video) return;

    setHasError(false);
    setIsLoading(true);
    setAvailableQualities([]);
    setSelectedQualityIndex(-1);

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    const rawStreamUrl = (currentMirror === 'backup' && channel.backupUrl) ? channel.backupUrl : channel.url;
    const streamUrl = (rawStreamUrl && rawStreamUrl.startsWith('http'))
      ? `/api/proxy-hls?url=${encodeURIComponent(rawStreamUrl)}`
      : rawStreamUrl;

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 30,
        maxBufferLength: isDataSaver ? 6 : 12,
        maxMaxBufferLength: isDataSaver ? 12 : 24,
        maxBufferSize: 30 * 1024 * 1024,
        maxBufferHole: 0.5,
        highBufferWatchdogPeriod: 2,
        nudgeOffset: 0.1,
        nudgeMaxRetry: 5,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        manifestLoadingTimeOut: 12000,
        manifestLoadingMaxRetry: 4,
        levelLoadingTimeOut: 12000,
        levelLoadingMaxRetry: 4,
        fragLoadingTimeOut: 15000,
        fragLoadingMaxRetry: 6,
      });

      hlsRef.current = hls;

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, (_event, data) => {
        setIsLoading(false);
        setHasError(false);
        video.play().catch(() => {
          video.muted = true;
          setIsMuted(true);
          video.play().catch(() => {});
        });

        if (data.levels && data.levels.length > 0) {
          const qualities: StreamQuality[] = data.levels.map((lvl, index) => ({
            index,
            height: lvl.height || (index === 0 ? 360 : index === 1 ? 480 : index === 2 ? 720 : 1080),
            bandwidth: lvl.bitrate || 0,
            label: lvl.height ? `${lvl.height}p` : `Качество ${index + 1}`
          }));
          setAvailableQualities(qualities);
        }
      });

      let netErrorCount = 0;
      hls.on(Hls.Events.ERROR, (_event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              netErrorCount++;
              if (netErrorCount <= 3) {
                console.warn(`[manibuTV] Network glitch detected (${netErrorCount}/3), reconnecting...`);
                hls.startLoad();
              } else {
                handleSilentFailover();
                hls.destroy();
              }
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.warn('[manibuTV] Media decoding error, attempting recovery...');
              hls.recoverMediaError();
              break;
            default:
              handleSilentFailover();
              hls.destroy();
              break;
          }
        }
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
      video.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        setHasError(false);
        video.play().catch(() => {});
      });
      video.addEventListener('error', () => {
        handleSilentFailover();
      });
    } else {
      handleSilentFailover();
    }

    const handleWaiting = () => {
      setIsLoading(true);
      if (hlsRef.current) {
        hlsRef.current.startLoad();
      }
      if (stallTimeoutRef.current) clearTimeout(stallTimeoutRef.current);
      stallTimeoutRef.current = setTimeout(() => {
        if (videoRef.current && videoRef.current.paused) {
          videoRef.current.play().catch(() => {});
        } else {
          handleSilentFailover();
        }
      }, 12000);
    };

    const handlePlaying = () => {
      setIsLoading(false);
      setHasError(false);
      if (stallTimeoutRef.current) clearTimeout(stallTimeoutRef.current);
    };

    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('stalled', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    return () => {
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('stalled', handleWaiting);
      video.removeEventListener('playing', handlePlaying);

      if (stallTimeoutRef.current) clearTimeout(stallTimeoutRef.current);
      if (retryTimeoutRef.current) clearTimeout(retryTimeoutRef.current);

      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [channel.url, channel.backupUrl, channel.embedUrl, isDataSaver, isIframeMode, currentMirror, handleSilentFailover]);

  const changeQuality = (index: number) => {
    setSelectedQualityIndex(index);
    setIsQualityMenuOpen(false);

    if (hlsRef.current) {
      hlsRef.current.currentLevel = index;
    }
  };

  const toggleDataSaver = () => {
    const nextSaver = !isDataSaver;
    setIsDataSaver(nextSaver);
    setIsQualityMenuOpen(false);

    if (hlsRef.current) {
      if (nextSaver) {
        const lowest = availableQualities.reduce((prev, curr) => (curr.height < prev.height ? curr : prev), availableQualities[0] || { index: 0, height: 360, bandwidth: 0, label: '360p' });
        if (lowest) {
          hlsRef.current.currentLevel = lowest.index;
          setSelectedQualityIndex(lowest.index);
        }
      } else {
        hlsRef.current.currentLevel = -1; // Auto
        setSelectedQualityIndex(-1);
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      } else if (e.key === ' ') {
        // Prevent space key from pausing live video
        e.preventDefault();
        videoRef.current?.play().catch(() => {});
      } else if (e.key === 'm' || e.key === 'M') {
        toggleMute();
      }
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      if (val === 0) {
        setIsMuted(true);
        videoRef.current.muted = true;
      } else if (isMuted) {
        setIsMuted(false);
        videoRef.current.muted = false;
      }
    }
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const reloadStream = () => {
    setHasError(false);
    setIsLoading(true);
    if (videoRef.current) {
      videoRef.current.load();
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseEnter={() => setIsControlsVisible(true)}
      onMouseLeave={() => setIsControlsVisible(false)}
      className="relative w-full aspect-video bg-black rounded-3xl overflow-hidden glass-card border border-white/80 shadow-2xl group flex items-center justify-center select-none"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-950/20 via-pink-950/20 to-black pointer-events-none" />

      {/* Top watermark badge */}
      <div className="absolute top-4 left-4 z-30 pointer-events-none flex items-center gap-2">
        <div className="px-3 py-1 rounded-2xl glass-pill backdrop-blur-xl border border-white/80 text-rose-950 font-script text-base font-bold shadow-md flex items-center gap-1.5">
          <Tv className="w-4 h-4 text-rose-600" />
          <span>manibuTV</span>
        </div>
      </div>

      {/* Video element or Iframe player */}
      {isIframeMode ? (
        <iframe
          src={getEmbedUrl(channel)}
          title={channel.name}
          className="w-full h-full border-0 relative z-10"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <video
          ref={videoRef}
          className="w-full h-full object-contain relative z-10 cursor-default"
          playsInline
          onPause={() => {
            // Live broadcast cannot be paused
            videoRef.current?.play().catch(() => {});
          }}
          onContextMenu={(e) => e.preventDefault()}
        />
      )}

      {/* Loading Indicator */}
      {isLoading && !hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-sm text-white">
          <div className="w-12 h-12 rounded-full border-4 border-rose-300/30 border-t-rose-500 animate-spin mb-3" />
          <span className="font-soft text-xs text-rose-200 animate-pulse flex items-center gap-2">
            <Radio className="w-4 h-4 text-rose-400 animate-bounce" />
            Подключение к прямому эфиру...
          </span>
        </div>
      )}

      {/* Stream Error Screen */}
      {hasError && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 bg-gradient-to-br from-rose-950/95 via-pink-950/90 to-black backdrop-blur-md text-white text-center">
          <div className="p-4 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/40 mb-3">
            <Tv className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-soft text-rose-100">
            Сигнал временно недоступен
          </h3>
          <p className="text-xs text-rose-300/80 max-w-md mt-1 mb-4 leading-relaxed font-sans-ui">
            Прямой эфир "{channel.name}" временно обновляет трансляцию. Вы можете переподключиться или выбрать другой канал!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={reloadStream}
              className="px-4 py-2 rounded-2xl glass-pill bg-rose-500/40 hover:bg-rose-500/60 text-white font-soft text-xs flex items-center gap-2 border border-white/40 transition-all shadow-lg cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Переподключиться
            </button>
          </div>
        </div>
      )}

      {/* Player Controls */}
      <div 
        className={`absolute bottom-0 inset-x-0 z-30 p-4 md:p-6 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="w-full max-w-4xl mx-auto px-4 py-2.5 rounded-3xl glass-card backdrop-blur-2xl border border-white/80 shadow-2xl flex items-center justify-between text-rose-950">
          
          {/* Left Controls: Live indicator + Volume */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs shadow-sm font-soft">
              <Radio className="w-3.5 h-3.5 animate-pulse" />
              <span>Прямой эфир</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-xl hover:bg-white/60 text-rose-950 transition-colors"
                title={isMuted ? 'Включить звук' : 'Выключить звук'}
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-rose-600" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 md:w-24 h-1.5 bg-rose-200/80 accent-rose-500 rounded-lg cursor-pointer"
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 relative">

            {/* Quality Selector Control */}
            <div className="relative">
              <button
                onClick={() => setIsQualityMenuOpen(!isQualityMenuOpen)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-2xl text-xs font-soft font-medium border transition-all ${
                  isDataSaver 
                    ? 'bg-amber-500 text-white border-amber-400 shadow-sm'
                    : 'bg-white/80 hover:bg-white text-rose-950 border-white/90'
                }`}
                title="Выбор качества эфира"
              >
                {isDataSaver ? <Zap className="w-3.5 h-3.5 text-amber-100" /> : <Wifi className="w-3.5 h-3.5 text-rose-700" />}
                <span>
                  {isDataSaver 
                    ? 'Экономия' 
                    : selectedQualityIndex === -1 
                      ? 'Авто HD' 
                      : availableQualities.find(q => q.index === selectedQualityIndex)?.label || 'HD'}
                </span>
                <ChevronDown className="w-3 h-3 ml-0.5 opacity-70" />
              </button>

              {/* Quality Dropdown Popup */}
              {isQualityMenuOpen && (
                <div className="absolute right-0 bottom-12 w-60 rounded-2xl glass-card backdrop-blur-2xl border border-white/90 shadow-2xl p-2 z-50 text-rose-950">
                  <div className="text-[11px] font-soft font-bold text-rose-900/80 px-2 py-1 uppercase tracking-wider border-b border-rose-100/60 mb-1">
                    Качество эфира manibuTV
                  </div>

                  <button
                    onClick={() => changeQuality(-1)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-soft transition-colors ${
                      selectedQualityIndex === -1 && !isDataSaver ? 'bg-rose-500 text-white font-bold' : 'hover:bg-rose-100/60'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Wifi className="w-3.5 h-3.5" /> Автоматически (Рекомендуется)
                    </span>
                    {selectedQualityIndex === -1 && !isDataSaver && <Check className="w-3.5 h-3.5" />}
                  </button>

                  {/* Manual Qualities */}
                  {availableQualities.map((q) => (
                    <button
                      key={q.index}
                      onClick={() => changeQuality(q.index)}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-soft transition-colors ${
                        selectedQualityIndex === q.index && !isDataSaver ? 'bg-rose-500 text-white font-bold' : 'hover:bg-rose-100/60'
                      }`}
                    >
                      <span>{q.label}</span>
                      {selectedQualityIndex === q.index && !isDataSaver && <Check className="w-3.5 h-3.5" />}
                    </button>
                  ))}

                  {/* Slow Internet Mode */}
                  <div className="border-t border-rose-100/60 mt-1 pt-1">
                    <button
                      onClick={toggleDataSaver}
                      className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-soft transition-colors ${
                        isDataSaver ? 'bg-amber-500 text-white font-bold' : 'hover:bg-amber-100/60 text-amber-900'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5" /> Экономия трафика (Слабый интернет)
                      </span>
                      {isDataSaver && <Check className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2.5 rounded-2xl bg-white/80 hover:bg-white text-rose-950 border border-white shadow-sm transition-transform active:scale-95"
              title={isFullscreen ? 'Выйти из полноэкранного режима (F)' : 'Полноэкранный режим (F)'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
