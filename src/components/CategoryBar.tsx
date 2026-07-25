import React from 'react';
import { CATEGORIES } from '../data/countries';

interface Props {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  getCategoryCount: (catId: string) => number;
}

export const CategoryBar: React.FC<Props> = ({
  selectedCategory,
  onSelectCategory,
  getCategoryCount
}) => {
  return (
    <div className="w-full overflow-x-auto pb-2 no-scrollbar">
      <div className="flex items-center gap-2 min-w-max px-1">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = getCategoryCount(cat.id);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-soft text-xs transition-all border ${
                isSelected
                  ? 'bg-rose-500 text-white font-bold border-rose-400 shadow-lg scale-105'
                  : 'glass-pill hover:bg-white/80 text-rose-950 border-white/70'
              }`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.nameRu}</span>
              <span className={`px-2 py-0.2 rounded-full text-[10px] ${
                isSelected ? 'bg-white/30 text-white font-bold' : 'bg-rose-200/50 text-rose-900 font-semibold'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
