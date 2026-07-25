import React, { useState } from 'react';
import { X, Cookie, Sparkles, Send, ExternalLink, Heart, Globe, Vote } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const EasterEggModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [cookieEatenCount, setCookieEatenCount] = useState<number>(0);
  const [voteCount, setVoteCount] = useState<number>(1488999);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-rose-950/40 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl glass-card rounded-3xl p-6 border-2 border-white/90 shadow-2xl overflow-hidden text-rose-950 max-h-[90vh] overflow-y-auto">
        
        {/* Background decorative lace glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-pink-300/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-rose-300/30 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-2xl bg-white/70 hover:bg-white text-rose-900 border border-white transition-all shadow-sm"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Delicate Header Art */}
        <div className="text-center space-y-1 mb-6">
          <div className="text-xs font-script text-rose-500 font-bold tracking-widest uppercase">
            ╭─── ༺ ❀ manibuTV Secret Corner ❀ ༻ ───╮
          </div>
          <h2 className="text-3xl font-script font-bold text-lace-title">
            Тайные Вселенные manibuTV
          </h2>
          <div className="text-sm font-caveat text-rose-800 font-bold">
            (⁠*⁠˘⁠︶⁠˘⁠*⁠)⁠.⁠｡⁠*⁠: Сладкие печеньки, Нибиру и Главный Чат
          </div>
        </div>

        {/* Section 1: Мария Нибиру 2028 */}
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-100/80 via-purple-50/70 to-pink-100/70 border border-white shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-soft font-bold text-sm text-indigo-950">
              <Vote className="w-4 h-4 text-purple-600" />
              Мария Нибиру в Президенты США 2028! 🇺🇸🪐
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-purple-200 text-purple-900 font-bold">
              NIBIRU-2028
            </span>
          </div>

          <p className="text-xs font-sans-ui text-indigo-900/80 leading-relaxed">
            Эксклюзивная новость manibuTV: Мария Нибиру выдвигает свою кандидатуру на пост Президента США 2028! 
            Главный пункт программы — межгалактический мир, прямые эфиры телеканалов 24/7 и свежие Crumbl Cookies каждому жителю Земли.
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setVoteCount(prev => prev + 1)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-soft text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              Отдать голос за Марию ({voteCount.toLocaleString()})
            </button>
            <span className="text-[11px] font-caveat text-purple-800 font-bold">
              (⁠✧⁠ω⁠✧⁠) 100% поддержка с Планеты Нибиру
            </span>
          </div>
        </div>

        {/* Section 2: Crumbl Cookies Clicker */}
        <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-amber-100/80 via-pink-50/70 to-orange-100/70 border border-white shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-soft font-bold text-sm text-amber-950">
              <Cookie className="w-4 h-4 text-amber-700" />
              Сладкий Спонсор: Crumbl Cookies 🍪
            </span>
            <span className="text-[10px] font-soft px-2 py-0.5 rounded-full bg-amber-200 text-amber-950 font-bold">
              Съедено: {cookieEatenCount}
            </span>
          </div>

          <p className="text-xs font-sans-ui text-amber-900/80 leading-relaxed">
            Смотрите прямые эфиры телеканалов на manibuTV под фирменный вкус свежеиспечённых печений Crumbl Cookies!
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={() => setCookieEatenCount(prev => prev + 1)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-soft text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Cъесть печенье Crumbl 🍪
            </button>
            <span className="text-[11px] font-caveat text-amber-900 font-bold">
              (⁠⊃⁠｡⁠•́⁠‿⁠•̀⁠｡⁠)⁠⊃ Вкусно и душевно!
            </span>
          </div>
        </div>

        {/* Section 3: Telegram Chat link */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-100/80 via-blue-50/70 to-cyan-100/70 border border-white shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 font-soft font-bold text-sm text-sky-950">
              <Send className="w-4 h-4 text-sky-600" />
              Секретный Чат Зрителей manibuTV 💬
            </span>
          </div>

          <p className="text-xs font-sans-ui text-sky-900/80 leading-relaxed">
            Присоединяйтесь к нашему уютному Telegram-чату! Обсуждаем каналы, выборы Марии Нибиру, выпечку Crumbl и новости.
          </p>

          <a
            href="https://t.me/+BX_21eqi1VplNzEx"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-4 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-soft text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
          >
            <span>Вступить в Telegram Чат</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Text Art Footer */}
        <div className="mt-5 text-center text-xs font-lace text-rose-700/80 italic space-y-1 border-t border-rose-200/50 pt-3">
          <div>╰─────────────────────────╯</div>
          <div>manibuTV • Бесплатное телевидение без рекламы и без ограничений</div>
          <div className="font-caveat font-bold text-rose-600">
            (⁠っ⁠˘⁠з⁠(⁠˘⁠⌣⁠˘⁠)⁠ Спасибо, что вы с нами!
          </div>
        </div>

      </div>
    </div>
  );
};
