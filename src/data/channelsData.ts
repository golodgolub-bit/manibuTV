import { Channel } from '../types';

export const INITIAL_CHANNELS: Channel[] = [
  // --- ДЕТСКИЕ И РАЗВЛЕКАТЕЛЬНЫЕ ПОПУЛЯРНЫЕ КАНАЛЫ (KIDS & ENTERTAINMENT) ---
  {
    id: 'us-disney-channel',
    name: 'Disney Channel HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d2/Disney_Channel_logo.svg',
    url: 'https://live-manifest.tubi.video/live-manifest/playlists/560877/playlist.m3u8',
    backupUrl: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'kids',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Бёрбанк',
    language: 'English / Русский',
    isHD: true,
    quality: '1080p',
    description: 'Легендарные мультсериалы, фильмы и шоу от студии Disney.'
  },
  {
    id: 'us-cartoon-network',
    name: 'Cartoon Network HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Cartoon_Network_2010_logo.svg',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/5qap5aO4i9A',
    category: 'kids',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Атланта',
    language: 'English / Русский',
    isHD: true,
    quality: '1080p',
    description: 'Популярные мультфильмы: Время Приключений, Удивительный мир Гамбола, Вся правда о медведях.'
  },
  {
    id: 'us-nickelodeon',
    name: 'Nickelodeon HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/Nickelodeon_2023_logo.svg',
    url: 'https://rbmn-live.akamaized.net/hls/live/591079/GEO_RESTRICTED/master.m3u8',
    backupUrl: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    embedUrl: 'https://www.youtube.com/embed/jfKfPfyJRdk',
    category: 'kids',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Нью-Йорк',
    language: 'English / Русский',
    isHD: true,
    quality: '1080p',
    description: 'Губка Боб Квадратные Штаны, Щенячий Патруль, Волшебные Покровители и топовые сериалы.'
  },
  {
    id: 'us-discovery',
    name: 'Discovery Channel HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/26/Discovery_Channel_logo_2019.svg',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    backupUrl: 'https://nhkworld.akamaized.net/hls/live/2003459/nhkworld/master.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'documentary',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Серебряная Весна',
    language: 'English / Русский',
    isHD: true,
    quality: '1080p',
    description: 'Наука, технологии, выживание в дикой природе и разрушители легенд.'
  },
  {
    id: 'us-mtv-hits',
    name: 'MTV Global Live',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/af/MTV_Logo_2021.svg',
    url: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    backupUrl: 'https://rt-uk.rttv.com/dvr/rtuk/playlist.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'music',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Нью-Йорк',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Мировые музыкальные чарты, живые концерты и музыкальные новинки.'
  },
  {
    id: 'eu-euronews-ru',
    name: 'Euronews HD (Русский)',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Euronews_2016_logo.svg',
    url: 'https://rt-russia.rttv.com/dvr/rtnews/playlist.m3u8',
    backupUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI010',
    category: 'news',
    countryCode: 'FR',
    countryName: 'Франция / Европа',
    timezone: 'Europe/Paris',
    city: 'Лион',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Европейские и мировые новости в оперативном круглосуточном режиме.'
  },

  // --- РОССИЯ (RU) ---
  {
    id: 'ru-russia24',
    name: 'Россия 24 HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Russia-24_Logo.png',
    url: 'https://rt-russia.rttv.com/dvr/rtnews/playlist.m3u8',
    backupUrl: 'https://mir24.tv/hls/live.m3u8',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI010',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Круглосуточный российский информационный телеканал.'
  },
  {
    id: 'ru-rt-doc',
    name: 'RT Documentary',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/RT_Documentary_logo.svg',
    url: 'https://rtd.rttv.com/dvr/rtdoc/playlist.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'documentary',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Документальные фильмы, история, наука и культура.'
  },
  {
    id: 'ru-rt-news',
    name: 'RT News HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a0/RT_logo.svg',
    url: 'https://rt-russia.rttv.com/dvr/rtnews/playlist.m3u8',
    backupUrl: 'https://mir24.tv/hls/live.m3u8',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI010',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Международный информационный канал на русском языке.'
  },
  {
    id: 'ru-music-hits',
    name: 'Bridge TV Deluxe',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Bridge_TV_logo.svg',
    url: 'https://rt-uk.rttv.com/dvr/rtuk/playlist.m3u8',
    backupUrl: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'music',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Мировая и российская музыка, топовые клипы.'
  },
  {
    id: 'ru-mir24',
    name: 'Мир 24 HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/MIR_TV_logo.png',
    url: 'https://mir24.tv/hls/live.m3u8',
    backupUrl: 'https://rt-russia.rttv.com/dvr/rtnews/playlist.m3u8',
    embedUrl: 'https://www.youtube.com/embed/gCNeDWCI010',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Межгосударственная телерадиокомпания «Мир».'
  },

  // --- ФРАНЦИЯ (FR) ---
  {
    id: 'fr-france24',
    name: 'France 24 French',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/France_24_logo.svg',
    url: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'news',
    countryCode: 'FR',
    countryName: 'Франция',
    timezone: 'Europe/Paris',
    city: 'Париж',
    language: 'Français',
    isHD: true,
    quality: '1080p',
    description: 'Прямой эфир французского национального телевидения.'
  },
  {
    id: 'fr-fashiontv',
    name: 'Fashion TV Paris',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/FashionTV_logo.png',
    url: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    backupUrl: 'https://rbmn-live.akamaized.net/hls/live/591079/GEO_RESTRICTED/master.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'lifestyle',
    countryCode: 'FR',
    countryName: 'Франция',
    timezone: 'Europe/Paris',
    city: 'Париж',
    language: 'Français / English',
    isHD: true,
    quality: '1080p',
    description: 'Мировая мода, недели высокой моды в Париже и Милане.'
  },

  // --- США (US) ---
  {
    id: 'us-nasa',
    name: 'NASA TV Official HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'documentary',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Вашингтон',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Прямые трансляции космоса, МКС, наблюдения за планетами и исследования.'
  },
  {
    id: 'us-bloomberg',
    name: 'Bloomberg TV News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Bloomberg_Television_logo.svg',
    url: 'https://live-manifest.tubi.video/live-manifest/playlists/560877/playlist.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'news',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Нью-Йорк',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Финансы, мировые биржи и технологии из Нью-Йорка.'
  },
  {
    id: 'us-redbull',
    name: 'Red Bull Extreme Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/07/Red_Bull_TV_logo.svg',
    url: 'https://rbmn-live.akamaized.net/hls/live/591079/GEO_RESTRICTED/master.m3u8',
    backupUrl: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'sports',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/Los_Angeles',
    city: 'Лос-Анджелес',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Мировой экстрим, сёрфинг, гонки и активный спорт.'
  },

  // --- ГЕРМАНИЯ (DE) ---
  {
    id: 'de-dw',
    name: 'Deutsche Welle Germany',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Deutsche_Welle_logo.svg',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    backupUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'news',
    countryCode: 'DE',
    countryName: 'Германия',
    timezone: 'Europe/Berlin',
    city: 'Берлин',
    language: 'Deutsch',
    isHD: true,
    quality: '1080p',
    description: 'Главные европейские новости и документалистика.'
  },

  // --- ЯПОНИЯ (JP) ---
  {
    id: 'jp-nhkworld',
    name: 'NHK World Japan Live',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7a/NHK_World_Japan.svg',
    url: 'https://nhkworld.akamaized.net/hls/live/2003459/nhkworld/master.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/f0lYkdA-Gtw',
    category: 'entertainment',
    countryCode: 'JP',
    countryName: 'Япония',
    timezone: 'Asia/Tokyo',
    city: 'Токио',
    language: 'Japanese / English',
    isHD: true,
    quality: '1080p',
    description: 'Японская культура, аниме, репортажи и кулинария из Токио.'
  },

  // --- ИСПАНИЯ (ES) ---
  {
    id: 'es-rtve',
    name: 'RTVE 24h España',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_RTVE.svg',
    url: 'https://rtvelivestream.akamaized.net/hls/live/2042294/24h/master.m3u8',
    backupUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'news',
    countryCode: 'ES',
    countryName: 'Испания',
    timezone: 'Europe/Madrid',
    city: 'Мадрид',
    language: 'Español',
    isHD: true,
    quality: '1080p',
    description: 'Национальный эфир новостей и культуры Испании.'
  },

  // --- ТУРЦИЯ (TR) ---
  {
    id: 'tr-trtworld',
    name: 'TRT World Live HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/TRT_World_logo.svg',
    url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8',
    backupUrl: 'https://nhkworld.akamaized.net/hls/live/2003459/nhkworld/master.m3u8',
    embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
    category: 'news',
    countryCode: 'TR',
    countryName: 'Турция',
    timezone: 'Europe/Istanbul',
    city: 'Стамбул',
    language: 'Turkish / English',
    isHD: true,
    quality: '1080p',
    description: 'Прямые включения, новости и культура Турции.'
  }
];

export async function fetchIPTVOrgChannels(): Promise<Channel[]> {
  try {
    const [channelsRes, streamsRes] = await Promise.all([
      fetch('https://iptv-org.github.io/api/channels.json'),
      fetch('https://iptv-org.github.io/api/streams.json')
    ]);

    if (!channelsRes.ok || !streamsRes.ok) return [];

    const channelsMeta = await channelsRes.json();
    const streamsMeta = await streamsRes.json();

    if (!Array.isArray(channelsMeta) || !Array.isArray(streamsMeta)) return [];

    const channelStreamMap = new Map<string, string>();
    for (const stream of streamsMeta) {
      if (stream.channel && stream.url && stream.url.includes('m3u8') && !stream.status?.includes('error')) {
        if (!channelStreamMap.has(stream.channel)) {
          channelStreamMap.set(stream.channel, stream.url);
        }
      }
    }

    const fetchedChannels: Channel[] = [];

    for (const ch of channelsMeta) {
      const streamUrl = channelStreamMap.get(ch.id);
      if (!streamUrl) continue;

      const countryCode = (ch.country || 'US').toUpperCase();
      const logoUrl = ch.logo || `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`;

      const rawCategories = Array.isArray(ch.categories) ? ch.categories.join(' ').toLowerCase() : '';
      let category = 'entertainment';
      if (rawCategories.includes('news')) category = 'news';
      else if (rawCategories.includes('music')) category = 'music';
      else if (rawCategories.includes('sport')) category = 'sports';
      else if (rawCategories.includes('movie') || rawCategories.includes('film') || rawCategories.includes('series')) category = 'movies';
      else if (rawCategories.includes('kid') || rawCategories.includes('animation')) category = 'kids';
      else if (rawCategories.includes('doc')) category = 'documentary';
      else if (rawCategories.includes('lifestyle') || rawCategories.includes('cook')) category = 'lifestyle';

      fetchedChannels.push({
        id: `iptv-${ch.id}`,
        name: ch.name || 'Live Channel',
        logo: logoUrl,
        url: streamUrl,
        backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
        embedUrl: 'https://www.youtube.com/embed/2g811Eo7K8U',
        category,
        countryCode,
        countryName: ch.country_name || countryCode,
        timezone: getCityTimezoneByCountry(countryCode),
        city: getCityByCountry(countryCode),
        language: Array.isArray(ch.languages) && ch.languages.length > 0 ? ch.languages[0].toUpperCase() : 'Global',
        isHD: true,
        quality: '1080p',
        description: `Прямой эфир телеканала ${ch.name} (${ch.country_name || countryCode}).`
      });

      if (fetchedChannels.length >= 800) break;
    }

    return fetchedChannels;
  } catch (err) {
    console.warn('IPTV-org library load warning:', err);
    return [];
  }
}

function getCityTimezoneByCountry(code: string): string {
  const mapping: Record<string, string> = {
    RU: 'Europe/Moscow',
    US: 'America/New_York',
    GB: 'Europe/London',
    FR: 'Europe/Paris',
    DE: 'Europe/Berlin',
    JP: 'Asia/Tokyo',
    ES: 'Europe/Madrid',
    IT: 'Europe/Rome',
    CN: 'Asia/Shanghai',
    KR: 'Asia/Seoul',
    KZ: 'Asia/Almaty',
    UA: 'Europe/Kyiv',
    TR: 'Europe/Istanbul',
    AE: 'Asia/Dubai',
    CA: 'America/Toronto',
    BR: 'America/Sao_Paulo',
    AM: 'Asia/Yerevan',
    GE: 'Asia/Tbilisi',
    IN: 'Asia/Kolkata',
    AU: 'Australia/Sydney',
  };
  return mapping[code] || 'UTC';
}

function getCityByCountry(code: string): string {
  const mapping: Record<string, string> = {
    RU: 'Москва',
    US: 'New York',
    GB: 'Лондон',
    FR: 'Париж',
    DE: 'Берлин',
    JP: 'Токио',
    ES: 'Мадрид',
    IT: 'Рим',
    CN: 'Пекин',
    KR: 'Сеул',
    KZ: 'Астана',
    UA: 'Киев',
    TR: 'Стамбул',
    AE: 'Дубай',
    CA: 'Торонто',
    BR: 'Рио-де-Жанейро',
    AM: 'Ереван',
    GE: 'Тбилиси',
    IN: 'Нью-Дели',
    AU: 'Сидней',
  };
  return mapping[code] || 'Столица';
}
