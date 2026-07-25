import { Channel } from '../types';

export const INITIAL_CHANNELS: Channel[] = [
  // --- НОВОСТИ И МИРОВЫЕ ЭФИРЫ (NEWS & WORLD LIVE) ---
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
  {
    id: 'fr-france24-en',
    name: 'France 24 English',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/France_24_logo.svg',
    url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    backupUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/h3MuIUNCCzI',
    category: 'news',
    countryCode: 'FR',
    countryName: 'Франция',
    timezone: 'Europe/Paris',
    city: 'Париж',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Прямой международный эфир канала France 24 из Парижа.'
  },
  {
    id: 'fr-france24-fr',
    name: 'France 24 Français',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/France_24_logo.svg',
    url: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/l8PMl7v052w',
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
    id: 'de-dw',
    name: 'Deutsche Welle News',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Deutsche_Welle_logo.svg',
    url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    backupUrl: 'https://dwamdstream104.akamaized.net/hls/live/2015527/dwstream104/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/vO-F325GkM0',
    category: 'news',
    countryCode: 'DE',
    countryName: 'Германия',
    timezone: 'Europe/Berlin',
    city: 'Берлин',
    language: 'English / Deutsch',
    isHD: true,
    quality: '1080p',
    description: 'Главные европейские новости, политика и экономика из Берлина.'
  },
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
    description: 'Японская культура, репортажи, аниме и новости из Токио.'
  },
  {
    id: 'us-nasa',
    name: 'NASA Live ISS Space',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e5/NASA_logo.svg',
    url: 'https://ntv1.akamaized.net/hls/live/2014075/NASA-NTV1-HLS/master.m3u8',
    backupUrl: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/P9C25Un7xaM',
    category: 'documentary',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'Вашингтон',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Прямая трансляция вида Земли с борта МКС и космические миссии NASA.'
  },
  {
    id: 'qa-aljazeera',
    name: 'Al Jazeera English Live',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/77/Al_Jazeera_English_logo.svg',
    url: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
    backupUrl: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
    embedUrl: 'https://www.youtube.com/embed/-y4v-kR2wLw',
    category: 'news',
    countryCode: 'AE',
    countryName: 'ОАЭ / Катар',
    timezone: 'Asia/Dubai',
    city: 'Доха',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Международный информационный эфир от телекомпании Al Jazeera.'
  },
  {
    id: 'sg-cna',
    name: 'CNA 24/7 Asia Live',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/df/CNA_logo_%282019%29.svg',
    url: 'https://nhkworld.akamaized.net/hls/live/2003459/nhkworld/master.m3u8',
    backupUrl: 'https://live-hls-web-aje.getaj.net/AJE/index.m3u8',
    embedUrl: 'https://www.youtube.com/embed/XWq5kBlakcQ',
    category: 'news',
    countryCode: 'JP',
    countryName: 'Сингапур / Азия',
    timezone: 'Asia/Tokyo',
    city: 'Сингапур',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Круглосуточный азиатский новостной и финансовый телеканал.'
  },
  {
    id: 'tr-trtworld',
    name: 'TRT World Live HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/90/TRT_World_logo.svg',
    url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8',
    backupUrl: 'https://nhkworld.akamaized.net/hls/live/2003459/nhkworld/master.m3u8',
    embedUrl: 'https://www.youtube.com/embed/f0lYkdA-Gtw',
    category: 'news',
    countryCode: 'TR',
    countryName: 'Турция',
    timezone: 'Europe/Istanbul',
    city: 'Стамбул',
    language: 'Turkish / English',
    isHD: true,
    quality: '1080p',
    description: 'Прямые включения, новости и культура Турции.'
  },
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
  {
    id: 'fr-fashiontv',
    name: 'Fashion TV Paris',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/c/c5/FashionTV_logo.png',
    url: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    backupUrl: 'https://rbmn-live.akamaized.net/hls/live/591079/GEO_RESTRICTED/master.m3u8',
    embedUrl: 'https://www.youtube.com/embed/h3MuIUNCCzI',
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
  {
    id: 'us-redbull',
    name: 'Red Bull Extreme Sports',
    logo: 'https://upload.wikimedia.org/wikipedia/en/0/07/Red_Bull_TV_logo.svg',
    url: 'https://rbmn-live.akamaized.net/hls/live/591079/GEO_RESTRICTED/master.m3u8',
    backupUrl: 'https://fashiontv-fashiontv-1-eu.rakuten.wurl.tv/playlist.m3u8',
    embedUrl: 'https://www.youtube.com/embed/P9C25Un7xaM',
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
  {
    id: 'es-rtve',
    name: 'RTVE 24h España',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Logo_RTVE.svg',
    url: 'https://rtvelivestream.akamaized.net/hls/live/2042294/24h/master.m3u8',
    backupUrl: 'https://static.france24.com/live/F24_FR_LO_HLS/live_tv.m3u8',
    embedUrl: 'https://www.youtube.com/embed/h3MuIUNCCzI',
    category: 'news',
    countryCode: 'ES',
    countryName: 'Испания',
    timezone: 'Europe/Madrid',
    city: 'Мадрид',
    language: 'Español',
    isHD: true,
    quality: '1080p',
    description: 'Национальный эфир новостей и культуры Испании.'
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
