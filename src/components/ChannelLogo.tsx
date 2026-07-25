import React, { useState } from 'react';
import { Tv } from 'lucide-react';

interface Props {
  logo: string;
  name: string;
  countryCode?: string;
  className?: string;
}

export const ChannelLogo: React.FC<Props> = ({ logo, name, countryCode = 'RU', className = 'w-12 h-12' }) => {
  const [hasError, setHasError] = useState(false);

  // Generate short initials
  const initials = name
    .replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '')
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const isFlagLogo = !logo || logo.includes('flagcdn.com');

  if (hasError || isFlagLogo) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 via-pink-500 to-rose-600 text-white font-bold font-soft shadow-inner overflow-hidden p-1 shrink-0 ${className}`}>
        <div className="flex flex-col items-center justify-center text-center">
          <Tv className="w-3.5 h-3.5 opacity-90 mb-0.5" />
          <span className="text-[10px] tracking-tight leading-none font-bold uppercase">{initials || 'TV'}</span>
        </div>
        {countryCode && (
          <img 
            src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`} 
            alt={countryCode}
            className="absolute bottom-0.5 right-0.5 w-3.5 h-2.5 rounded-[2px] shadow-sm object-cover border border-white/60"
          />
        )}
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center rounded-2xl bg-white p-1.5 border border-white/90 shadow-inner shrink-0 overflow-hidden ${className}`}>
      <img
        src={logo}
        alt={name}
        loading="lazy"
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
};

