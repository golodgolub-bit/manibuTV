import React, { useState, useEffect } from 'react';
import { Clock, MapPin, Globe2, Heart, ShieldCheck, Cookie } from 'lucide-react';
import { Channel } from '../types';
import { getTimezoneDetails } from '../utils/time';
import { ChannelLogo } from './ChannelLogo';

interface Props {
  channel: Channel;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const ChannelDetailsBar: React.FC<Props> = ({
  channel,
  isFavorite,
  onToggleFavorite,
}) => {
  const [tzData, setTzData] = useState(() => getTimezoneDetails(channel.timezone));

  useEffect(() => {
    const interval = setInterval(() => {
      setTzData(getTimezoneDetails(channel.timezone));
    }, 1000);

    return () => clearInterval(interval);
  }, [channel.timezone]);

  return (
    <div className="w-full glass-card rounded-3xl p-5 md:p-6 border border-white/80 shadow-lg text-[#4a1525] transition-all relative overflow-hidden">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Channel Info & Flag */}
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <ChannelLogo
              logo={channel.logo}
              name={channel.name}
              countryCode={channel.countryCode}
              className="w-16 h-16 md:w-20 md:h-20"
            />
            <span className="absolute -bottom-1 -right-1 text-2xl drop-shadow-sm">
              {getCountryFlag(channel.countryCode)}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-200/60 text-rose-900 border border-white/80 uppercase tracking-wide">
                {channel.category}
              </span>
              {channel.isHD && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold shadow-sm">
                  {channel.quality || 'HD 1080p'}
                </span>
              )}
              <span className="flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                Прямой эфир
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-soft font-bold text-rose-950 mt-1 flex items-center gap-2 flex-wrap">
              <span>{channel.name}</span>
              <button 
                onClick={onToggleFavorite}
                className="p-1.5 rounded-full hover:bg-rose-200/60 transition-transform active:scale-125"
                title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
              >
                <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
              </button>
            </h1>

            <p className="text-xs md:text-sm text-rose-800/80 mt-0.5 font-sans-ui">
              {channel.description || `Прямая трансляция телеканала ${channel.name} в высоком качестве на manibuTV.`}
            </p>
          </div>
        </div>

        {/* Region & Timezone World Clock Card */}
        <div className="flex items-center gap-4 p-3.5 md:p-4 rounded-2xl bg-gradient-to-br from-white/80 via-rose-50/70 to-rose-100/50 border border-white/90 shadow-md shrink-0">
          <div className="text-center px-3 border-r border-rose-200/60 pr-4">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-700 flex items-center justify-center gap-1 font-soft">
              <MapPin className="w-3 h-3 text-rose-500" />
              Регион
            </div>
            <div className="text-sm font-bold text-rose-950 mt-0.5 font-soft">
              {channel.countryName}
            </div>
            <div className="text-[11px] text-rose-800 font-sans-ui">
              {channel.city}
            </div>
          </div>

          <div className="text-center px-2">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-700 flex items-center justify-center gap-1 font-soft">
              <Clock className="w-3 h-3 text-rose-500" />
              Время региона
            </div>
            <div className="text-xl md:text-2xl font-mono font-bold text-rose-950 tracking-tight mt-0.5 flex items-center justify-center gap-1.5">
              <span>{tzData.localTimeStr}</span>
              <span className="text-base">{tzData.dayNightIcon}</span>
            </div>
            <div className="text-[10px] text-rose-800/90 flex items-center justify-center gap-1 font-sans-ui">
              <span>{tzData.dateStr}</span>
              <span className="px-1.5 py-0.2 rounded bg-rose-200/60 text-rose-950 font-semibold">{tzData.utcOffsetStr}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer info inside bar */}
      <div className="mt-3 pt-2 border-t border-rose-200/50 flex flex-wrap items-center justify-between text-[11px] text-rose-800 gap-2 font-soft">
        <span className="flex items-center gap-1">
          <Globe2 className="w-3.5 h-3.5 text-rose-500" />
          Язык вещания: <strong className="text-rose-950">{channel.language}</strong>
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          manibuTV Stream Direct
        </span>
        <span className="flex items-center gap-1 text-rose-800 font-medium text-xs">
          Прямой эфир со всего мира
        </span>
      </div>
    </div>
  );
};

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    RU: '🇷🇺', US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪',
    JP: '🇯🇵', ES: '🇪🇸', IT: '🇮🇹', CN: '🇨🇳', KR: '🇰🇷',
    KZ: '🇰🇿', UA: '🇺🇦', TR: '🇹🇷', AE: '🇦🇪', CA: '🇨🇦',
    BR: '🇧🇷', AM: '🇦🇲', GE: '🇬🇪', IN: '🇮🇳', AU: '🇦🇺'
  };
  return flags[code] || '🌐';
}
