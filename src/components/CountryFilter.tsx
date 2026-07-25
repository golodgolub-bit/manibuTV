import React, { useMemo } from 'react';
import { COUNTRIES } from '../data/countries';
import { Globe2 } from 'lucide-react';

interface CountryItem {
  code: string;
  name: string;
  flag: string;
  count: number;
}

interface Props {
  selectedCountry: string;
  onSelectCountry: (code: string) => void;
  getCountryCount: (code: string) => number;
  availableCountries?: CountryItem[];
}

function getFlagEmoji(code: string): string {
  if (!code || code === 'ALL' || code.length !== 2) return '🌍';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

export const CountryFilter: React.FC<Props> = React.memo(({
  selectedCountry,
  onSelectCountry,
  getCountryCount,
  availableCountries = []
}) => {
  const topCountryCodes = useMemo(() => new Set(COUNTRIES.map(c => c.code)), []);

  // Sorted list of all available countries for dropdown selector
  const sortedAllCountries = useMemo(() => {
    if (availableCountries.length > 0) {
      return [...availableCountries].sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }
    return COUNTRIES.map(c => ({
      code: c.code,
      name: c.nameRu,
      flag: c.flag,
      count: getCountryCount(c.code)
    })).filter(c => c.code !== 'ALL').sort((a, b) => a.name.localeCompare(b.name, 'ru'));
  }, [availableCountries, getCountryCount]);

  return (
    <div className="w-full glass-card rounded-3xl p-3 border border-white/80 shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 px-1 text-xs font-soft font-bold text-rose-900">
        <div className="flex items-center gap-2">
          <Globe2 className="w-4 h-4 text-rose-500" />
          <span>Выбор страны трансляции ({sortedAllCountries.length} стран):</span>
        </div>

        {/* Dropdown select for all 160+ countries */}
        <select
          value={selectedCountry}
          onChange={(e) => onSelectCountry(e.target.value)}
          className="px-3 py-1 rounded-2xl bg-white text-rose-950 border border-rose-300 text-xs font-soft font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-400 cursor-pointer"
        >
          <option value="ALL">🌍 Все страны ({getCountryCount('ALL')})</option>
          {sortedAllCountries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.flag} {c.name} ({getCountryCount(c.code)})
            </option>
          ))}
        </select>
      </div>

      {/* Top featured country quick buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {COUNTRIES.map((c) => {
          const isSelected = selectedCountry === c.code;
          const count = getCountryCount(c.code);

          return (
            <button
              key={c.code}
              onClick={() => onSelectCountry(c.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-soft text-xs whitespace-nowrap transition-all border cursor-pointer ${
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
