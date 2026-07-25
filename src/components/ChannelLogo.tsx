import React, { useState } from 'react';
import { Tv } from 'lucide-react';

interface Props {
  logo: string;
  name: string;
  countryCode?: string;
  className?: string;
}

export const ChannelLogo: React.FC<Props> = ({ logo, name, countryCode = 'US', className = 'w-12 h-12' }) => {
  const [hasError, setHasError] = useState(false);

  // Generate short initials (e.g., "Disney Channel" -> "DC", "Cartoon Network" -> "CN")
  const initials = name
    .split(' ')
    .map(word => word[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();

  if (hasError || !logo) {
    return (
      <div className={`relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 text-white font-bold font-soft shadow-inner overflow-hidden p-1 shrink-0 ${className}`}>
        <div className="flex flex-col items-center justify-center text-center">
          <Tv className="w-3.5 h-3.5 opacity-90 mb-0.5" />
          <span className="text-[10px] tracking-tight leading-none font-bold uppercase">{initials || 'TV'}</span>
        </div>
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
