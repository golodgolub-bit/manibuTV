import React, { useState, useEffect } from 'react';
import { Subtitles, Settings2 } from 'lucide-react';

interface Props {
  channelName: string;
  isEnabled: boolean;
  onToggleEnabled: () => void;
  nativeSubtitles?: string;
}

export const SubtitlesOverlay: React.FC<Props> = ({
  channelName,
  isEnabled,
  nativeSubtitles
}) => {
  const [currentText, setCurrentText] = useState<string>('');
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');

  useEffect(() => {
    if (!isEnabled) {
      setCurrentText('');
      return;
    }

    if (nativeSubtitles) {
      setCurrentText(nativeSubtitles);
      return;
    }

    const samplePhrases = [
      `Прямой эфир ${channelName} • События и новости часа в хорошем качестве`,
      `В эфире информационно-аналитический выпуск программы`,
      `Оставайтесь с нами, прямая трансляция телеканала продолжается`,
      `Смотрите в следующем блоке: репортаж и последние мировые новости`,
      `Интервью с экспертами и включения корреспондентов`
    ];

    let idx = 0;
    const interval = setInterval(() => {
      setCurrentText(samplePhrases[idx % samplePhrases.length]);
      idx++;
    }, 7000);

    setCurrentText(samplePhrases[0]);

    return () => clearInterval(interval);
  }, [isEnabled, channelName, nativeSubtitles]);

  if (!isEnabled) return null;

  const fontClasses = {
    sm: 'text-xs md:text-sm py-1.5 px-3',
    md: 'text-sm md:text-base py-2 px-4',
    lg: 'text-base md:text-lg py-2.5 px-5'
  };

  return (
    <div className="absolute bottom-16 inset-x-0 mx-auto w-full max-w-2xl px-4 flex flex-col items-center z-30 pointer-events-none">
      <div className="pointer-events-auto mb-2 flex items-center gap-2 px-3 py-1 rounded-2xl glass-pill text-xs text-rose-950 border border-white/70 shadow-lg">
        <div className="flex items-center gap-1.5 font-medium">
          <Subtitles className="w-3.5 h-3.5 text-rose-600" />
          <span>Субтитры</span>
        </div>
        <button
          onClick={() => setFontSize(fontSize === 'sm' ? 'md' : fontSize === 'md' ? 'lg' : 'sm')}
          className="p-1 rounded-lg bg-white/60 hover:bg-white text-rose-950 transition-colors ml-auto"
          title="Размер шрифта"
        >
          <Settings2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className={`pointer-events-auto text-center rounded-2xl glass-card backdrop-blur-xl border border-white/80 text-rose-950 font-medium shadow-xl transition-all duration-300 max-w-full ${fontClasses[fontSize]}`}>
        <div className="leading-relaxed tracking-wide text-rose-950">
          {currentText}
        </div>
      </div>
    </div>
  );
};
