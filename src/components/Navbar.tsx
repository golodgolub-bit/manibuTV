import React, { useState } from 'react';
import { Search, Tv, Heart, X, MessageCircle, Cookie, Sparkles } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  isFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalChannels: number;
  onOpenEasterEggModal: () => void;
}

export const Navbar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  favoritesCount,
  isFavoritesOnly,
  onToggleFavoritesOnly,
  totalChannels,
  onOpenEasterEggModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3.5">
      <div className="max-w-7xl mx-auto glass-card rounded-3xl p-3 md:p-4 border border-white/80 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-3 text-rose-950">
        
        {/* Brand Logo & Delicate Lace Header */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-rose-600 text-white shadow-md border border-white/80 relative">
              <Tv className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 text-xs animate-bounce">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-script font-bold tracking-wide text-rose-950 text-lace-title leading-none">
                  manibuTV
                </h1>
                <span className="text-xs font-caveat px-2 py-0.5 rounded-full bg-rose-200/70 text-rose-900 border border-white font-bold hidden sm:inline-block">
                  (⁠◕⁠‿⁠◕⁠)⁠♡
                </span>
              </div>
              <p className="text-[11px] font-soft text-rose-800/80 -mt-0.5">
                {totalChannels} онлайн-каналов со всего мира • Бесплатно 24/7
              </p>
            </div>
          </div>

          {/* Mobile Easter Egg & Telegram Chat Shortcuts */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={onOpenEasterEggModal}
              className="p-2 rounded-2xl bg-amber-100/80 text-amber-900 border border-amber-200/80 hover:bg-amber-200 transition-colors"
              title="Crumbl & Нибиру"
            >
              <Cookie className="w-4 h-4 text-amber-700" />
            </button>
            <a
              href="https://t.me/+BX_21eqi1VplNzEx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-2xl bg-sky-100/80 text-sky-900 border border-sky-200/80 hover:bg-sky-200 transition-colors"
              title="Чат зрителей manibuTV"
            >
              <MessageCircle className="w-4 h-4 text-sky-600" />
            </a>
          </div>
        </div>

        {/* Search Input Bar */}
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-rose-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск каналов... (⁠⊃⁠｡⁠•́⁠‿⁠•̀⁠｡⁠)⁠⊃"
            className="w-full pl-10 pr-8 py-2 rounded-2xl glass-input text-xs font-soft text-rose-950 placeholder:text-rose-400"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-rose-200/60 text-rose-500"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Telegram Chat + Crumbl/Nibiru + Favorites */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Telegram Chat Button */}
          <a
            href="https://t.me/+BX_21eqi1VplNzEx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-soft bg-sky-100/70 hover:bg-sky-200/80 text-sky-900 border border-sky-200 transition-all shadow-sm"
            title="Присоединиться к чату зрителей manibuTV"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Чат Telegram</span>
          </a>

          {/* Crumbl & Nibiru Easter Egg Modal Launcher */}
          <button
            onClick={onOpenEasterEggModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-soft bg-gradient-to-r from-amber-100 via-pink-100 to-purple-100 hover:from-amber-200 text-rose-950 border border-white shadow-sm transition-transform active:scale-95"
            title="Секретные отсылки Crumbl Cookies & Нибиру"
          >
            <Cookie className="w-3.5 h-3.5 text-amber-700 animate-spin-slow" />
            <span>Нибиру & Cookies</span>
            <Sparkles className="w-3 h-3 text-pink-500" />
          </button>

          {/* Favorites Filter Button */}
          <button
            onClick={onToggleFavoritesOnly}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-soft transition-all border ${
              isFavoritesOnly
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold border-rose-400 shadow-md scale-105'
                : 'glass-pill text-rose-900 hover:bg-white/80 border-white'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavoritesOnly ? 'fill-white' : 'text-rose-500'}`} />
            <span>Избранное</span>
            {favoritesCount > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] ${isFavoritesOnly ? 'bg-white text-rose-600 font-bold' : 'bg-rose-200 text-rose-900 font-bold'}`}>
                {favoritesCount}
              </span>
            )}
          </button>
        </div>

      </div>
    </header>
  );
};
