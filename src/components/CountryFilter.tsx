import React from 'react';
import { COUNTRIES } from '../data/countries';
import { Globe2 } from 'lucide-react';

interface Props {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
  getCountryCount: (code: string) => number;
}

export const CountryFilter: React.FC<Props> = React.memo(({
  selectedCountry,
  onSelectCountry,
  getCountryCount
}) => {
  return (
    <div className="w-full glass-card rounded-3xl p-3 border border-white/80 shadow-md">
      <div className="flex items-center gap-2 mb-2 px-1 text-xs font-soft font-bold text-rose-900">
        <Globe2 className="w-4 h-4 text-rose-500" />
        <span>Выбор страны трансляции:</span>
        <span className="text-[10px] font-normal text-rose-700 italic ml-auto">
          ─── 𓆩♡𓆪 ───
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {COUNTRIES.map((c) => {
          const isSelected = selectedCountry === c.code;
          const count = getCountryCount(c.code);

          return (
            <button
              key={c.code}
              onClick={() => onSelectCountry(c.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-soft text-xs whitespace-nowrap transition-all border ${
                isSelected
                  ? 'bg-rose-500 text-white font-bold border-rose-400 shadow-md'
                  : 'bg-white/50 hover:bg-white text-rose-950 border-white/80'
              }`}
            >
              <span className="text-sm">{c.flag}</span>
              <span>{c.nameRu}</span>
              {count > 0 && (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected ? 'bg-white/30 text-white font-bold' : 'bg-rose-200/60 text-rose-900'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
