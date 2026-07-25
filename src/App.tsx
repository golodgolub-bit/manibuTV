import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CategoryBar } from './components/CategoryBar';
import { CountryFilter } from './components/CountryFilter';
import { ChannelCard } from './components/ChannelCard';
import { VideoPlayer } from './components/VideoPlayer';
import { ChannelDetailsBar } from './components/ChannelDetailsBar';
import { INITIAL_CHANNELS, fetchIPTVOrgChannels, fetchFamelackChannels } from './data/channelsData';
import { Channel } from './types';
import { RefreshCw, Radio, Sparkles, MessageCircle, Heart } from 'lucide-react';

export default function App() {
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<Channel>(INITIAL_CHANNELS[0]);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isFavoritesOnly, setIsFavoritesOnly] = useState<boolean>(false);

  // Toast Notification state for Favorites action
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Favorites persisted in localStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('manibu_tv_favorites');
      return saved ? JSON.parse(saved) : ['ru-russia24', 'ru-rt-doc', 'fr-france24', 'us-nasa'];
    } catch {
      return ['ru-russia24', 'ru-rt-doc', 'fr-france24', 'us-nasa'];
    }
  });

  const [isLoadingMoreChannels, setIsLoadingMoreChannels] = useState<boolean>(false);

  // Sync favorites with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('manibu_tv_favorites', JSON.stringify(favorites));
    } catch (e) {
      console.warn('Could not save favorites to localStorage:', e);
    }
  }, [favorites]);

  // Load extra Famelack channels in background
  useEffect(() => {
    async function loadExtendedChannels() {
      setIsLoadingMoreChannels(true);
      const famelackChannels = await fetchFamelackChannels();
      if (famelackChannels.length > 0) {
        setChannels((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const uniqueNew = famelackChannels.filter((c) => !existingIds.has(c.id));
          return [...prev, ...uniqueNew];
        });
      }

      const extraChannels = await fetchIPTVOrgChannels();
      if (extraChannels.length > 0) {
        setChannels((prev) => {
          const existingIds = new Set(prev.map((c) => c.id));
          const uniqueNew = extraChannels.filter((c) => !existingIds.has(c.id));
          return [...prev, ...uniqueNew];
        });
      }
      setIsLoadingMoreChannels(false);
    }

    loadExtendedChannels();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Toggle Favorite callback
  const toggleFavorite = useCallback((channelId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    setFavorites((prev) => {
      const exists = prev.includes(channelId);
      const updated = exists ? prev.filter((id) => id !== channelId) : [...prev, channelId];
      
      const targetChannel = channels.find(c => c.id === channelId);
      const channelName = targetChannel ? targetChannel.name : 'Канал';

      if (exists) {
        showToast(`"${channelName}" удалён из Избранного`);
      } else {
        showToast(`"${channelName}" добавлен в Избранное!`);
      }

      return updated;
    });
  }, [channels]);

  // Filter channels logic with Memoization
  const filteredChannels = useMemo(() => {
    return channels.filter((channel) => {
      if (selectedCategory !== 'ALL' && channel.category !== selectedCategory) {
        return false;
      }

      if (selectedCountry !== 'ALL' && channel.countryCode !== selectedCountry) {
        return false;
      }

      if (isFavoritesOnly && !favorites.includes(channel.id)) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = channel.name.toLowerCase().includes(q);
        const matchesCountry = channel.countryName.toLowerCase().includes(q) || channel.countryCode.toLowerCase().includes(q);
        const matchesCity = channel.city.toLowerCase().includes(q);
        const matchesCategory = channel.category.toLowerCase().includes(q);
        const matchesLang = channel.language.toLowerCase().includes(q);

        if (!matchesName && !matchesCountry && !matchesCity && !matchesCategory && !matchesLang) {
          return false;
        }
      }

      return true;
    });
  }, [channels, selectedCategory, selectedCountry, isFavoritesOnly, favorites, searchQuery]);

  // Auto-switch selected channel if filtered channel list updates
  useEffect(() => {
    if (isFavoritesOnly && filteredChannels.length > 0) {
      if (!favorites.includes(selectedChannel.id)) {
        setSelectedChannel(filteredChannels[0]);
      }
    }
  }, [isFavoritesOnly, filteredChannels, favorites, selectedChannel.id]);

  const getCategoryCount = useCallback((catId: string) => {
    if (catId === 'ALL') return channels.length;
    return channels.filter((c) => c.category === catId).length;
  }, [channels]);

  const getCountryCount = useCallback((code: string) => {
    if (code === 'ALL') return channels.length;
    return channels.filter((c) => c.countryCode === code).length;
  }, [channels]);

  return (
    <div className="min-h-screen pb-20 bg-[#fcf2f5] text-[#4a1525] relative selection:bg-rose-400 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl glass-card bg-rose-950 text-white border border-rose-400/50 shadow-2xl font-soft text-xs font-bold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-pink-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        favoritesCount={favorites.length}
        isFavoritesOnly={isFavoritesOnly}
        onToggleFavoritesOnly={() => setIsFavoritesOnly(!isFavoritesOnly)}
        totalChannels={channels.length}
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 mt-3 space-y-6">

        {/* Active Video Player + Detailed Clock & Region Bar */}
        <section className="space-y-4">
          <VideoPlayer channel={selectedChannel} />
          
          <ChannelDetailsBar
            channel={selectedChannel}
            isFavorite={favorites.includes(selectedChannel.id)}
            onToggleFavorite={() => toggleFavorite(selectedChannel.id)}
          />
        </section>

        {/* Delicate Openwork Lace Divider */}
        <div className="text-center text-xs font-script text-rose-400 my-2 select-none">
          ❀ ─── ༺ ❀ manibuTV ❀ ༻ ─── ❀
        </div>

        {/* Filter Controls Bar */}
        <section className="space-y-4">
          <CategoryBar
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            getCategoryCount={getCategoryCount}
          />

          <CountryFilter
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            getCountryCount={getCountryCount}
          />
        </section>

        {/* Channel Grid Section Header */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2 text-sm font-bold font-soft text-rose-950">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Каналы ({filteredChannels.length})</span>
            {isLoadingMoreChannels && (
              <span className="text-xs text-rose-600 font-normal flex items-center gap-1 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin text-rose-500" />
                Подключение каналов со всего мира...
              </span>
            )}
          </div>

          {(selectedCategory !== 'ALL' || selectedCountry !== 'ALL' || searchQuery || isFavoritesOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedCountry('ALL');
                setSearchQuery('');
                setIsFavoritesOnly(false);
              }}
              className="text-xs font-soft text-rose-700 hover:text-rose-950 underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        {/* Channel Cards Grid */}
        {filteredChannels.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredChannels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                isSelected={selectedChannel.id === channel.id}
                isFavorite={favorites.includes(channel.id)}
                onSelect={() => {
                  setSelectedChannel(channel);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                onToggleFavorite={(e) => toggleFavorite(channel.id, e)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center glass-card rounded-3xl border border-white/80 my-8">
            <div className="text-3xl mb-3">📺 (⁠•⁠-⁠•⁠)</div>
            <h3 className="text-lg font-bold font-soft text-rose-950">
              Каналы по вашему запросу не найдены
            </h3>
            <p className="text-xs text-rose-800/80 max-w-sm mx-auto mt-1 mb-4 font-sans-ui">
              Попробуйте сбросить фильтры или изменить поисковый запрос!
            </p>
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setSelectedCountry('ALL');
                setSearchQuery('');
                setIsFavoritesOnly(false);
              }}
              className="px-5 py-2.5 rounded-2xl bg-rose-500 text-white font-semibold font-soft text-xs shadow-md hover:bg-rose-600 transition-colors"
            >
              Показать все каналы manibuTV
            </button>
          </div>
        )}
      </main>

      {/* Footer & Telegram Chat Button */}
      <footer className="mt-16 border-t border-rose-200/60 pt-8 pb-12 text-center text-xs text-rose-800 font-soft space-y-2">
        <div className="text-lg font-script text-lace-title font-bold">
          manibuTV ✧ Бесплатный Мировой ТВ Эфир
        </div>
        <div className="text-rose-700/80 text-xs font-medium">
          Прямой эфир со всего мира • 24/7 Live
        </div>
        <div className="flex items-center justify-center gap-4 pt-3">
          <a
            href="https://t.me/+BX_21eqi1VplNzEx"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Чат зрителей в Telegram</span>
          </a>
        </div>
      </footer>
    </div>
  );
}
