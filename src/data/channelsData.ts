import { Channel } from '../types';

export async function fetchFamelackChannels(): Promise<Channel[]> {
  try {
    const res = await fetch('/api/famelack/channels?limit=1000');
    if (!res.ok) return [];
    const data = await res.json();
    if (data && Array.isArray(data.channels)) {
      return data.channels.map((ch: any) => ({
        id: ch.id,
        name: ch.name,
        logo: ch.logo || `https://flagcdn.com/w160/${(ch.countryCode || 'us').toLowerCase()}.png`,
        url: ch.url,
        backupUrl: ch.backupUrl || '',
        embedUrl: ch.embedUrl || '',
        category: ch.category || 'entertainment',
        countryCode: ch.countryCode || 'RU',
        countryName: ch.countryName || 'Россия',
        timezone: getCityTimezoneByCountry(ch.countryCode),
        city: getCityByCountry(ch.countryCode),
        language: ch.language || 'Русский / English',
        isHD: true,
        quality: '1080p',
        description: ch.description || `Официальный эфир ${ch.name}.`
      }));
    }
    return [];
  } catch (err) {
    console.warn('Failed to load Famelack channels:', err);
    return [];
  }
}

export const INITIAL_CHANNELS: Channel[] = [
  // --- НОВОСТИ И МИРОВЫЕ ЭФИРЫ (NEWS & WORLD LIVE) ---
  {
    id: 'famelack-3ABN-RU',
    name: '3ABN Russia',
    logo: 'https://i.imgur.com/uGzZ54H.png',
    url: 'https://3abn.bozztv.com/3abn2/Rus_live/smil:Rus_live.smil/playlist.m3u8',
    backupUrl: 'https://hls.tv.3angels.ru/stream.m3u8',
    embedUrl: '',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Прямой эфир русского вещательного телеканала.'
  },
  {
    id: 'famelack-360-RU',
    name: '360° Новости HD',
    logo: 'https://i.imgur.com/VTJqdoX.png',
    url: 'https://live-vgtrksmotrim.cdnvideo.ru/vgtrksmotrim/smotrim-live-04-srt.smil/playlist.m3u8',
    backupUrl: 'https://live-vgtrksmotrim.cdnvideo.ru/vgtrksmotrim/smotrim-live-03-srt.smil/playlist.m3u8',
    embedUrl: '',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Прямые трансляции главных событий, культура и новости Подмосковья.'
  },
  {
    id: 'famelack-360news-RU',
    name: '360° News Live',
    logo: 'https://i.imgur.com/VTJqdoX.png',
    url: 'https://live-vgtrksmotrim.cdnvideo.ru/vgtrksmotrim/smotrim-live-03-srt.smil/playlist.m3u8',
    backupUrl: 'https://live2-aisttv.cdnvideo.ru/aisttv2/aisttv.sdp/playlist.m3u8',
    embedUrl: '',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Круглосуточные новости в прямом эфире.'
  },
  {
    id: 'famelack-sitv86-RU',
    name: 'СургутИнформТВ (СИТВ 86)',
    logo: 'https://sitv.ru/images/logo.png',
    url: 'https://sitv.ru/hls/s86.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'news',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Asia/Yekaterinburg',
    city: 'Сургут',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Региональное вещание и актуальные новости Югры.'
  },
  {
    id: 'famelack-15music-RU',
    name: '15+ Music TV',
    logo: 'https://i.imgur.com/7oNe8xj.png',
    url: 'https://live.15plusmg.ru/memfs/ce3366b1-bf25-4e24-96bb-1adf0d44bd3d.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'music',
    countryCode: 'RU',
    countryName: 'Россия',
    timezone: 'Europe/Moscow',
    city: 'Москва',
    language: 'Русский',
    isHD: true,
    quality: '1080p',
    description: 'Современные музыкальные клипы и хиты в прямом эфире.'
  },
  {
    id: 'famelack-20min-FR',
    name: '20 Minutes TV Paris',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e0/20_minutes_logo.svg',
    url: 'https://live-20minutestv.digiteka.com/1961167769/index.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'news',
    countryCode: 'FR',
    countryName: 'Франция',
    timezone: 'Europe/Paris',
    city: 'Париж',
    language: 'Français',
    isHD: true,
    quality: '1080p',
    description: 'Французское новостное и развлекательное телевидение.'
  },
  {
    id: 'famelack-africa24-FR',
    name: 'Africa 24 Live',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/2/23/Africa24_logo.png',
    url: 'https://africa24.vedge.infomaniak.com/livecast/ik:africa24/manifest.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'news',
    countryCode: 'FR',
    countryName: 'Франция / Африка',
    timezone: 'Europe/Paris',
    city: 'Париж',
    language: 'Français / English',
    isHD: true,
    quality: '1080p',
    description: 'Информационное вещание панафриканского канала Africa 24.'
  },
  {
    id: 'famelack-alexberlin-DE',
    name: 'Alex Berlin TV',
    logo: 'https://i.imgur.com/K3G2sY8.png',
    url: 'https://alex-stream.rosebud-media.de/bounce/alexlive.smil/playlist.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'entertainment',
    countryCode: 'DE',
    countryName: 'Германия',
    timezone: 'Europe/Berlin',
    city: 'Берлин',
    language: 'Deutsch',
    isHD: true,
    quality: '1080p',
    description: 'Общественное берлинское телевидение, культура и музыка.'
  },
  {
    id: 'famelack-ardalpha-DE',
    name: 'ARD-alpha Германия',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/13/ARD_alpha_logo.svg',
    url: 'https://mcdn.br.de/br/fs/ard_alpha/hls/de/master.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'documentary',
    countryCode: 'DE',
    countryName: 'Германия',
    timezone: 'Europe/Berlin',
    city: 'Мюнхен',
    language: 'Deutsch',
    isHD: true,
    quality: '1080p',
    description: 'Образовательные и познавательные программы от медиасети ARD.'
  },
  {
    id: 'famelack-4uv-US',
    name: '4UV USA Network',
    logo: 'https://flagcdn.com/w160/us.png',
    url: 'https://d3qg1liq0unuxm.cloudfront.net/4UV.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'entertainment',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/New_York',
    city: 'New York',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Американский развлекательный и молодежный канал от Famelack.'
  },
  {
    id: 'famelack-21jump-US',
    name: '21 Jump Street TV',
    logo: 'https://flagcdn.com/w160/us.png',
    url: 'https://d1oefjzrirx6fc.cloudfront.net/21_Jump_Street/index.m3u8',
    backupUrl: '',
    embedUrl: '',
    category: 'movies',
    countryCode: 'US',
    countryName: 'США',
    timezone: 'America/Los_Angeles',
    city: 'Los Angeles',
    language: 'English',
    isHD: true,
    quality: '1080p',
    description: 'Классические сериалы и кинематограф 24/7.'
  }
];

export async function fetchIPTVOrgChannels(): Promise<Channel[]> {
  try {
    const [channelsRes, streamsRes, logosRes] = await Promise.all([
      fetch('https://iptv-org.github.io/api/channels.json'),
      fetch('https://iptv-org.github.io/api/streams.json'),
      fetch('https://iptv-org.github.io/api/logos.json')
    ]);

    if (!channelsRes.ok || !streamsRes.ok) return [];

    const channelsMeta = await channelsRes.json();
    const streamsMeta = await streamsRes.json();
    const logosMeta = logosRes.ok ? await logosRes.json() : [];

    if (!Array.isArray(channelsMeta) || !Array.isArray(streamsMeta)) return [];

    const logoMap = new Map<string, string>();
    if (Array.isArray(logosMeta)) {
      for (const l of logosMeta) {
        if (l.channel && l.url && !logoMap.has(l.channel)) {
          logoMap.set(l.channel, l.url);
        }
      }
    }

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
      const logoUrl = logoMap.get(ch.id) || ch.logo || `https://flagcdn.com/w160/${countryCode.toLowerCase()}.png`;

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
