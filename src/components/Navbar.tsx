import React, { useState } from 'react';
import { Search, Tv, Heart, X, MessageCircle, Sparkles, Cookie } from 'lucide-react';

interface Props {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  favoritesCount: number;
  isFavoritesOnly: boolean;
  onToggleFavoritesOnly: () => void;
  totalChannels: number;
}

export const Navbar: React.FC<Props> = ({
  searchQuery,
  onSearchChange,
  favoritesCount,
  isFavoritesOnly,
  onToggleFavoritesOnly,
  totalChannels,
}) => {
  const [showSecretModal, setShowSecretModal] = useState<boolean>(false);

  return (
    <header className="sticky top-0 z-40 w-full px-3 py-3.5">
      <div className="max-w-7xl mx-auto glass-card rounded-3xl p-3 md:p-4 border border-white/80 shadow-lg flex flex-col lg:flex-row items-center justify-between gap-3 text-rose-950">
        
        {/* Brand Logo & Delicate Lace Header */}
        <div className="flex items-center justify-between w-full lg:w-auto gap-3">
          <div className="flex items-center gap-3">
            <div 
              onClick={() => setShowSecretModal(true)}
              className="p-2.5 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-rose-600 text-white shadow-md border border-white/80 relative cursor-pointer group"
              title="Пасхалка manibuTV ✨"
            >
              <Tv className="w-6 h-6 transition-transform group-hover:scale-110" />
              <span className="absolute -top-1 -right-1 text-xs animate-bounce">✨</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-script font-bold tracking-wide text-rose-950 text-lace-title leading-none">
                  manibuTV
                </h1>
                <button
                  onClick={() => setShowSecretModal(true)}
                  className="text-[11px] font-soft px-2 py-0.5 rounded-full bg-rose-200/70 hover:bg-rose-300 text-rose-900 border border-white font-semibold hidden sm:inline-block cursor-pointer transition-colors"
                  title="Нажмите для секретной информации"
                >
                  Live TV ✨
                </button>
              </div>
              <p className="text-[11px] font-soft text-rose-800/80 -mt-0.5">
                {totalChannels} онлайн-каналов со всего мира • Бесплатно 24/7
              </p>
            </div>
          </div>

          {/* Mobile Telegram Link */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="https://t.me/+BX_21eqi1VplNzEx"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-2xl bg-sky-100/80 text-sky-900 border border-sky-200/80 hover:bg-sky-200 transition-colors flex items-center gap-1 text-xs font-soft font-bold"
              title="Чат зрителей manibuTV"
            >
              <MessageCircle className="w-4 h-4 text-sky-600" />
              <span>Чат</span>
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
            placeholder="Поиск по каналам, жанрам, странам..."
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

        {/* Action Buttons: Telegram Chat + Favorites */}
        <div className="hidden lg:flex items-center gap-2.5">
          {/* Telegram Chat Button */}
          <a
            href="https://t.me/+BX_21eqi1VplNzEx"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-soft bg-sky-100/80 hover:bg-sky-200/90 text-sky-950 border border-sky-200 transition-all shadow-sm font-bold"
            title="Присоединиться к чату зрителей manibuTV"
          >
            <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
            <span>Чат Telegram</span>
          </a>

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

      {/* Secret Easter Egg Modal */}
      {showSecretModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md glass-card rounded-3xl p-6 border border-white shadow-2xl text-rose-950 space-y-4">
            <button
              onClick={() => setShowSecretModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-rose-200/60 transition-colors text-rose-900"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-rose-500 text-white shadow-md">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-script font-bold text-2xl text-rose-950">
                  Секретные отсылки manibuTV 🪐
                </h3>
                <p className="text-xs text-rose-700 font-soft">
                  Эксклюзивная Пасхалка для внимательных зрителей
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-white/60 p-4 rounded-2xl border border-rose-200/60 text-xs font-soft text-rose-900">
              <div className="flex items-start gap-2.5">
                <span className="text-base">🪐</span>
                <div>
                  <strong>Планета Нибиру:</strong> Послы из избирательного штаба Марии Нибиру передают привет всем зрителям!
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-base">🍪</span>
                <div>
                  <strong>Crumbl Cookies:</strong> Свежая порция фирменного печения ждёт каждого участника выборов в США 2028.
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="text-base">💬</span>
                <div>
                  <strong>Общение в Telegram:</strong> Вступайте в наш уютный чат зрителей:{' '}
                  <a
                    href="https://t.me/+BX_21eqi1VplNzEx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sky-700 underline font-bold hover:text-sky-900"
                  >
                    t.me/+BX_21eqi1VplNzEx
                  </a>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSecretModal(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold font-soft text-xs shadow-md hover:opacity-95 transition-opacity"
            >
              Закрыть пасхалку ♡
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
