import React, { useState } from 'react';
import { Tv } from 'lucide-react';

interface Props {
  logo: string;
  name: string;
  countryCode?: string;
  className?: string;
}

const GRADIENTS = [
  'from-rose-500 via-pink-500 to-rose-600',
  'from-indigo-500 via-purple-500 to-indigo-600',
  'from-blue-500 via-cyan-500 to-blue-600',
  'from-emerald-500 via-teal-500 to-emerald-600',
  'from-amber-500 via-orange-500 to-rose-500',
  'from-violet-500 via-fuchsia-500 to-purple-600',
];

export const ChannelLogo: React.FC<Props> = React.memo(({ logo, name, countryCode = 'RU', className = 'w-12 h-12' }) => {
  const [hasError, setHasError] = useState(false);

  // Generate short initials
  const cleanName = name.replace(/[^a-zA-Zа-яА-Я0-9\s]/g, '').trim();
  const words = cleanName.split(/\s+/).filter(Boolean);
  
  let initials = '';
  if (words.length >= 2) {
    initials = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1) {
    initials = words[0].slice(0, 3).toUpperCase();
  } else {
    initials = 'TV';
  }

  // Hash gradient selection
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const gradientClass = GRADIENTS[Math.abs(hash) % GRADIENTS.length];

  const isFlagLogo = !logo || logo.includes('flagcdn.com');

  if (hasError || isFlagLogo) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br ${gradientClass} text-white font-bold font-soft shadow-inner overflow-hidden p-1 shrink-0 ${className}`}>
        <div className="flex flex-col items-center justify-center text-center w-full px-0.5">
          <Tv className="w-3.5 h-3.5 opacity-90 mb-0.5" />
          <span className="text-[10px] tracking-tight leading-none font-bold uppercase truncate max-w-full">
            {initials}
          </span>
        </div>
        {countryCode && (
          <img 
            src={`https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`} 
            alt={countryCode}
            loading="lazy"
            decoding="async"
            className="absolute bottom-0.5 right-0.5 w-3.5 h-2.5 rounded-[2px] shadow-sm object-cover border border-white/80"
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
        decoding="async"
        className="w-full h-full object-contain"
        onError={() => setHasError(true)}
      />
    </div>
  );
});

