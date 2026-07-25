import React from 'react';
import { Heart, Play } from 'lucide-react';
import { Channel } from '../types';

interface Props {
  channel: Channel;
  isSelected: boolean;
  isFavorite: boolean;
  onSelect: () => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
}

export const ChannelCard: React.FC<Props> = React.memo(({
  channel,
  isSelected,
  isFavorite,
  onSelect,
  onToggleFavorite
}) => {
  return (
    <div
      onClick={onSelect}
      className={`relative group cursor-pointer rounded-3xl p-4 glass-card glass-card-hover transition-all duration-300 border ${
        isSelected 
          ? 'bg-rose-100/90 border-rose-400 ring-2 ring-rose-300/80 shadow-xl scale-[1.02]' 
          : 'border-white/80 hover:border-rose-300/80'
      }`}
    >
      {/* Top badges: Flag & Category & Favorite button */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-2xl bg-white/70 backdrop-blur-md border border-white text-xs font-soft text-rose-950 shadow-sm">
          <span className="text-sm">{getCountryFlag(channel.countryCode)}</span>
          <span className="font-semibold">{channel.countryCode}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-soft font-bold px-2 py-0.5 rounded-full bg-rose-200/60 text-rose-900 border border-white/80 uppercase tracking-wide">
            {channel.category}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(e);
            }}
            className="p-1.5 rounded-full hover:bg-rose-200/70 transition-transform active:scale-125 text-rose-400"
            title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          >
            <Heart className={`w-4 h-4 transition-colors ${isFavorite ? 'fill-rose-500 text-rose-500' : 'text-rose-400'}`} />
          </button>
        </div>
      </div>

      {/* Channel Logo and Name */}
      <div className="flex items-center gap-3.5 my-2">
        <div className="relative w-12 h-12 rounded-2xl bg-white/90 p-1.5 border border-white shadow-inner flex items-center justify-center shrink-0 overflow-hidden">
          <img
            src={channel.logo}
            alt={channel.name}
            loading="lazy"
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-rose-800 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-100/95 backdrop-blur-xs">
            <Play className="w-4 h-4 fill-rose-600 text-rose-600" />
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-soft font-bold text-sm text-rose-950 truncate group-hover:text-rose-700 transition-colors">
            {channel.name}
          </h3>
          <p className="text-xs text-rose-800/80 font-sans-ui truncate mt-0.5">
            {channel.city} • {channel.language}
          </p>
        </div>
      </div>

      {/* Bottom live indicator and delicate text decoration */}
      <div className="mt-3 pt-2.5 border-t border-rose-200/50 flex items-center justify-between text-[10px] font-soft text-rose-700">
        <span className="flex items-center gap-1 font-semibold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          В ЭФИРЕ
        </span>
        <span className="text-rose-500 font-caveat text-xs font-bold">
          (⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠♡
        </span>
      </div>
    </div>
  );
});

function getCountryFlag(code: string): string {
  const flags: Record<string, string> = {
    RU: '🇷🇺', US: '🇺🇸', GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪',
    JP: '🇯🇵', ES: '🇪🇸', IT: '🇮🇹', CN: '🇨🇳', KR: '🇰🇷',
    KZ: '🇰🇿', UA: '🇺🇦', TR: '🇹🇷', AE: '🇦🇪', CA: '🇨🇦',
    BR: '🇧🇷', AM: '🇦🇲', GE: '🇬🇪', IN: '🇮🇳', AU: '🇦🇺'
  };
  return flags[code] || '🌐';
}
