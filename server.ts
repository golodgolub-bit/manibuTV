import express from "express";
import path from "path";
import zlib from "zlib";
import { createServer as createViteServer } from "vite";

// Ignore SSL errors for fetching streams (many IPTV streams have invalid/expired certs)
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "manibuTV", dataset: "famelack" });
});

// Cache for Famelack TV Channels
let cachedFamelackChannels: any[] = [];
let lastCacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour

const countryNames: Record<string, string> = {
  ru: "Россия",
  us: "США",
  fr: "Франция",
  de: "Германия",
  es: "Испания",
  tr: "Турция",
  ua: "Украина",
  kz: "Казахстан",
  gb: "Великобритания",
  jp: "Япония",
  ca: "Канада",
  it: "Италия",
  ae: "ОАЭ",
  br: "Бразилия",
  cn: "Китай"
};

const categoryMap: Record<string, string> = {
  news: "news",
  "top-news": "news",
  movies: "movies",
  series: "movies",
  music: "music",
  sports: "sports",
  kids: "kids",
  animation: "kids",
  documentary: "documentary",
  science: "documentary",
  entertainment: "entertainment",
  comedy: "entertainment",
  show: "entertainment",
  lifestyle: "lifestyle",
  cooking: "lifestyle",
  auto: "sports",
  travel: "lifestyle"
};

// Comprehensive Russian Country Names & Capital Cities
const countryNamesRuMap: Record<string, { country: string; capital: string }> = {
  AD: { country: "Андорра", capital: "Андорра-ла-Велья" },
  AE: { country: "ОАЭ", capital: "Дубай" },
  AF: { country: "Афганистан", capital: "Кабул" },
  AG: { country: "Антигуа и Барбуда", capital: "Сент-Джонс" },
  AL: { country: "Албания", capital: "Тирана" },
  AM: { country: "Армения", capital: "Ереван" },
  AO: { country: "Ангола", capital: "Луанда" },
  AR: { country: "Аргентина", capital: "Буэнос-Айрес" },
  AT: { country: "Австрия", capital: "Вена" },
  AU: { country: "Австралия", capital: "Сидней" },
  AW: { country: "Аруба", capital: "Ораньестад" },
  AZ: { country: "Азербайджан", capital: "Баку" },
  BA: { country: "Босния и Герцеговина", capital: "Сараево" },
  BD: { country: "Бангладеш", capital: "Дакка" },
  BE: { country: "Бельгия", capital: "Брюссель" },
  BF: { country: "Буркина-Фасо", capital: "Уагадугу" },
  BG: { country: "Болгария", capital: "София" },
  BH: { country: "Бахрейн", capital: "Манама" },
  BJ: { country: "Бенин", capital: "Порто-Ново" },
  BO: { country: "Боливия", capital: "Ла-Пас" },
  BQ: { country: "Бонайре", capital: "Кралендейк" },
  BR: { country: "Бразилия", capital: "Рио-де-Жанейро" },
  BS: { country: "Багамы", capital: "Нассау" },
  BY: { country: "Беларусь", capital: "Минск" },
  BZ: { country: "Белиз", capital: "Бельмопан" },
  CA: { country: "Канада", capital: "Торонто" },
  CD: { country: "Конго (ДРК)", capital: "Киншаса" },
  CG: { country: "Конго", capital: "Браззавиль" },
  CH: { country: "Швейцария", capital: "Цюрих" },
  CI: { country: "Кот-д'Ивуар", capital: "Ямусукро" },
  CL: { country: "Чили", capital: "Сантьяго" },
  CM: { country: "Камерун", capital: "Яунде" },
  CN: { country: "Китай", capital: "Пекин" },
  CO: { country: "Колумбия", capital: "Богота" },
  CR: { country: "Коста-Рика", capital: "Сан-Хосе" },
  CU: { country: "Куба", capital: "Гавана" },
  CW: { country: "Кюрасао", capital: "Виллемстад" },
  CY: { country: "Кипр", capital: "Никосия" },
  CZ: { country: "Чехия", capital: "Прага" },
  DE: { country: "Германия", capital: "Берлин" },
  DJ: { country: "Джибути", capital: "Джибути" },
  DK: { country: "Дания", capital: "Копенгаген" },
  DO: { country: "Доминикана", capital: "Санто-Доминго" },
  DZ: { country: "Алжир", capital: "Алжир" },
  EC: { country: "Эквадор", capital: "Кито" },
  EE: { country: "Эстония", capital: "Таллин" },
  EG: { country: "Египет", capital: "Каир" },
  ER: { country: "Эритрея", capital: "Асмэра" },
  ES: { country: "Испания", capital: "Мадрид" },
  ET: { country: "Эфиопия", capital: "Аддис-Абеба" },
  FI: { country: "Финляндия", capital: "Хельсинки" },
  FO: { country: "Фареры", capital: "Торсхавн" },
  FR: { country: "Франция", capital: "Париж" },
  GE: { country: "Грузия", capital: "Тбилиси" },
  GF: { country: "Французская Гвиана", capital: "Кайенна" },
  GH: { country: "Гана", capital: "Аккра" },
  GL: { country: "Гренландия", capital: "Нуук" },
  GM: { country: "Гамбия", capital: "Банжул" },
  GN: { country: "Гвинея", capital: "Конакри" },
  GP: { country: "Гваделупа", capital: "Бас-Тер" },
  GR: { country: "Греция", capital: "Афины" },
  GT: { country: "Гватемала", capital: "Гватемала" },
  GU: { country: "Гуам", capital: "Хагатна" },
  GY: { country: "Гайана", capital: "Джорджтаун" },
  HK: { country: "Гонконг", capital: "Гонконг" },
  HN: { country: "Гондурас", capital: "Тегусигальпа" },
  HR: { country: "Хорватия", capital: "Загреб" },
  HT: { country: "Гаити", capital: "Порт-о-Пренс" },
  HU: { country: "Венгрия", capital: "Будапешт" },
  ID: { country: "Индонезия", capital: "Джакарта" },
  IE: { country: "Ирландия", capital: "Дублин" },
  IL: { country: "Израиль", capital: "Иерусалим" },
  IN: { country: "Индия", capital: "Нью-Дели" },
  IQ: { country: "Ирак", capital: "Багдад" },
  IR: { country: "Иран", capital: "Тегеран" },
  IS: { country: "Исландия", capital: "Рейкьявик" },
  IT: { country: "Италия", capital: "Рим" },
  JM: { country: "Ямайка", capital: "Кингстон" },
  JO: { country: "Иордания", capital: "Амман" },
  JP: { country: "Япония", capital: "Токио" },
  KE: { country: "Кения", capital: "Найроби" },
  KH: { country: "Камбоджа", capital: "Пномпень" },
  KN: { country: "Сент-Китс", capital: "Бастер" },
  KR: { country: "Южная Корея", capital: "Сеул" },
  KW: { country: "Кувейт", capital: "Эль-Кувейт" },
  KZ: { country: "Казахстан", capital: "Астана" },
  LA: { country: "Лаос", capital: "Вьентьян" },
  LB: { country: "Ливан", capital: "Бейрут" },
  LC: { country: "Сент-Люсия", capital: "Кастри" },
  LK: { country: "Шри-Ланка", capital: "Коломбо" },
  LT: { country: "Литва", capital: "Вильнюс" },
  LU: { country: "Люксембург", capital: "Люксембург" },
  LV: { country: "Латвия", capital: "Рига" },
  LY: { country: "Ливия", capital: "Триполи" },
  MA: { country: "Марокко", capital: "Рабат" },
  MC: { country: "Монако", capital: "Монако" },
  MD: { country: "Молдова", capital: "Кишинев" },
  ME: { country: "Черногория", capital: "Подгорица" },
  MK: { country: "Северная Македония", capital: "Скопье" },
  ML: { country: "Мали", capital: "Бамако" },
  MM: { country: "Мьянма", capital: "Нейпьидо" },
  MN: { country: "Монголия", capital: "Улан-Батор" },
  MO: { country: "Макао", capital: "Макао" },
  MQ: { country: "Мартиника", capital: "Фор-де-Франс" },
  MT: { country: "Мальта", capital: "Валлетта" },
  MV: { country: "Мальдивы", capital: "Мале" },
  MX: { country: "Мексика", capital: "Мехико" },
  MY: { country: "Малайзия", capital: "Куала-Лумпур" },
  MZ: { country: "Мозамбик", capital: "Мапуту" },
  NE: { country: "Нигер", capital: "Ниамей" },
  NG: { country: "Нигерия", capital: "Абуджа" },
  NI: { country: "Никарагуа", capital: "Манагуа" },
  NL: { country: "Нидерланды", capital: "Амстердам" },
  NO: { country: "Норвегия", capital: "Осло" },
  NP: { country: "Непал", capital: "Катманду" },
  NZ: { country: "Новая Зеландия", capital: "Веллингтон" },
  OM: { country: "Оман", capital: "Маскат" },
  PA: { country: "Панама", capital: "Панама" },
  PE: { country: "Перу", capital: "Лима" },
  PG: { country: "Папуа — Новая Гвинея", capital: "Порт-Морсби" },
  PH: { country: "Филиппины", capital: "Манила" },
  PK: { country: "Пакистан", capital: "Исламабад" },
  PL: { country: "Польша", capital: "Варшава" },
  PR: { country: "Пуэрто-Рико", capital: "Сан-Хуан" },
  PS: { country: "Палестина", capital: "Рамалла" },
  PT: { country: "Португалия", capital: "Лиссабон" },
  PY: { country: "Парагвай", capital: "Асунсьон" },
  QA: { country: "Катар", capital: "Доха" },
  RO: { country: "Румыния", capital: "Бухарест" },
  RS: { country: "Сербия", capital: "Белград" },
  RU: { country: "Россия", capital: "Москва" },
  RW: { country: "Руанда", capital: "Кигали" },
  SA: { country: "Саудовская Аравия", capital: "Эр-Рияд" },
  SD: { country: "Судан", capital: "Хартум" },
  SE: { country: "Швеция", capital: "Стокгольм" },
  SG: { country: "Сингапур", capital: "Сингапур" },
  SI: { country: "Словения", capital: "Любляна" },
  SK: { country: "Словакия", capital: "Братислава" },
  SL: { country: "Сьерра-Леоне", capital: "Фритаун" },
  SN: { country: "Сенегал", capital: "Дакар" },
  SR: { country: "Суринам", capital: "Парамарибо" },
  SV: { country: "Сальвадор", capital: "Сан-Сальвадор" },
  SX: { country: "Синт-Мартен", capital: "Филипсбург" },
  SY: { country: "Сирия", capital: "Дамаск" },
  TD: { country: "Чад", capital: "Нджамена" },
  TG: { country: "Того", capital: "Ломе" },
  TH: { country: "Таиланд", capital: "Бангкок" },
  TJ: { country: "Таджикистан", capital: "Душанбе" },
  TN: { country: "Тунис", capital: "Тунис" },
  TR: { country: "Турция", capital: "Стамбул" },
  TT: { country: "Тринидад и Тобаго", capital: "Порт-оф-Спейн" },
  TW: { country: "Тайвань", capital: "Тайбэй" },
  TZ: { country: "Танзания", capital: "Додома" },
  UA: { country: "Украина", capital: "Киев" },
  UG: { country: "Уганда", capital: "Кампала" },
  UK: { country: "Великобритания", capital: "Лондон" },
  GB: { country: "Великобритания", capital: "Лондон" },
  US: { country: "США", capital: "Вашингтон" },
  UY: { country: "Уругвай", capital: "Монтевидео" },
  UZ: { country: "Узбекистан", capital: "Ташкент" },
  VE: { country: "Венесуэла", capital: "Каракас" },
  VG: { country: "Виргинские о-ва", capital: "Род-Таун" },
  VN: { country: "Вьетнам", capital: "Ханой" },
  XK: { country: "Косово", capital: "Приштина" },
  YE: { country: "Йемен", capital: "Сана" },
  ZA: { country: "ЮАР", capital: "Претория" },
  ZW: { country: "Зимбабве", capital: "Хараре" }
};

const languageNameMap: Record<string, string> = {
  rus: "Русский",
  eng: "Английский",
  fra: "Французский",
  deu: "Немецкий",
  ger: "Немецкий",
  spa: "Испанский",
  ita: "Итальянский",
  por: "Португальский",
  tur: "Турецкий",
  zho: "Китайский",
  chi: "Китайский",
  jpn: "Японский",
  kor: "Корейский",
  ara: "Арабский",
  ukr: "Украинский",
  kaz: "Казахский",
  kat: "Грузинский",
  geo: "Грузинский",
  hye: "Армянский",
  arm: "Армянский",
  pol: "Польский",
  ron: "Румынский",
  bul: "Болгарский",
  srp: "Сербский",
  ell: "Греческий",
  gre: "Греческий",
  hin: "Хинди",
  ind: "Индонезийский",
  vie: "Вьетнамский",
  tha: "Тайский",
  heb: "Иврит"
};

let logoByNameMap: Record<string, string> = {};
let logoMapLoaded = false;

function addLogoMapKey(key: string, url: string) {
  if (!key) return;
  const norm = key.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "");
  if (norm && !logoByNameMap[norm]) logoByNameMap[norm] = url;
  
  const clean = key.toLowerCase()
    .replace(/\b(hd|sd|live|tv|онлайн|канал|360|plus|\+)\b/gi, "")
    .replace(/[^a-z0-9а-яё]/gi, "");
  if (clean && !logoByNameMap[clean]) logoByNameMap[clean] = url;
}

async function loadLogoMap() {
  if (logoMapLoaded && Object.keys(logoByNameMap).length > 0) return;
  try {
    const [channelsRes, logosRes] = await Promise.all([
      fetch("https://iptv-org.github.io/api/channels.json"),
      fetch("https://iptv-org.github.io/api/logos.json")
    ]);
    if (channelsRes.ok && logosRes.ok) {
      const channels = await channelsRes.json();
      const logos = await logosRes.json();
      const logoByChannelId: Record<string, string> = {};
      
      for (const l of logos) {
        if (l.channel && l.url && !logoByChannelId[l.channel]) {
          logoByChannelId[l.channel] = l.url;
        }
      }

      for (const c of channels) {
        const logoUrl = logoByChannelId[c.id];
        if (logoUrl) {
          addLogoMapKey(c.name, logoUrl);
          addLogoMapKey(c.id, logoUrl);
          const idWithoutExt = c.id.split(".")[0];
          addLogoMapKey(idWithoutExt, logoUrl);

          if (c.alt_names && Array.isArray(c.alt_names)) {
            for (const alt of c.alt_names) {
              addLogoMapKey(alt, logoUrl);
            }
          }
        }
      }
      logoMapLoaded = true;
      console.log(`[Logo Map] Loaded ${Object.keys(logoByNameMap).length} channel logo mappings.`);
    }
  } catch (e) {
    console.warn("Failed to load iptv-org logos map:", e);
  }
}

const regionNamesRu = new Intl.DisplayNames(['ru'], { type: 'region' });

function getCountryNameRu(code: string): string {
  const upper = code.toUpperCase();
  if (countryNamesRuMap[upper]) return countryNamesRuMap[upper].country;
  try {
    return regionNamesRu.of(upper) || upper;
  } catch (e) {
    return upper;
  }
}

function getCityRu(code: string): string {
  const upper = code.toUpperCase();
  if (countryNamesRuMap[upper]) return countryNamesRuMap[upper].capital;
  return getCountryNameRu(upper);
}

async function loadFamelackChannelsFromSource() {
  await loadLogoMap();

  const targetCountries = [
    "ad","ae","af","ag","al","am","ao","ar","at","au","aw","az","ba","bd","be","bf","bg","bh","bj","bo","bq","br","bs","by","bz","ca","cd","cg","ch","ci","cl","cm","cn","co","cr","cu","cw","cy","cz","de","dj","dk","do","dz","ec","ee","eg","er","es","et","fi","fo","fr","ge","gf","gh","gl","gm","gn","gp","gr","gt","gu","gy","hk","hn","hr","ht","hu","id","ie","il","in","iq","ir","is","it","jm","jo","jp","ke","kh","kn","kr","kw","kz","la","lb","lc","lk","lt","lu","lv","ly","ma","mc","md","me","mk","ml","mm","mn","mo","mq","mt","mv","mx","my","mz","ne","ng","ni","nl","no","np","nz","om","pa","pe","pg","ph","pk","pl","pr","ps","pt","py","qa","ro","rs","ru","rw","sa","sd","se","sg","si","sk","sl","sn","sr","sv","sx","sy","td","tg","th","tj","tn","tr","tt","tw","tz","ua","ug","uk","us","uy","uz","ve","vg","vn","xk","ye","za","zw"
  ];
  const categoriesList = ["news", "movies", "music", "sports", "kids", "documentary", "entertainment"];

  const categoryMapByNanoid: Record<string, string> = {};

  // Build category index
  for (const cat of categoriesList) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/famelack/famelack-data/main/tv/compressed/categories/${cat}.json`);
      if (res.ok) {
        const buf = await res.arrayBuffer();
        const raw = JSON.parse(zlib.gunzipSync(Buffer.from(buf)).toString());
        for (const item of raw) {
          if (item.nanoid && !categoryMapByNanoid[item.nanoid]) {
            categoryMapByNanoid[item.nanoid] = cat;
          }
        }
      }
    } catch (e) {
      // Ignore category fetch error
    }
  }

  const allChannels: any[] = [];
  const seenIds = new Set<string>();

  const chunkSize = 20;
  for (let i = 0; i < targetCountries.length; i += chunkSize) {
    const chunk = targetCountries.slice(i, i + chunkSize);
    await Promise.all(chunk.map(async (cc) => {
      try {
        const res = await fetch(`https://raw.githubusercontent.com/famelack/famelack-data/main/tv/compressed/countries/${cc}.json`);
        if (!res.ok) return;
        const buf = await res.arrayBuffer();
        const raw = JSON.parse(zlib.gunzipSync(Buffer.from(buf)).toString());

        for (const item of raw) {
          if (!item.sources || !item.sources.streams || item.sources.streams.length === 0) continue;
          if (seenIds.has(item.nanoid)) continue;
          seenIds.add(item.nanoid);

          const rawCat = categoryMapByNanoid[item.nanoid] || "general";
          const mappedCategory = categoryMap[rawCat] || "entertainment";

          const normName = item.name.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "");
          const cleanName = item.name.toLowerCase().replace(/\b(hd|sd|live|tv|онлайн|канал|360|plus|\+)\b/gi, "").replace(/[^a-z0-9а-яё]/gi, "");
          const countryCodeUpper = (item.country || cc).toUpperCase();

          const matchedLogo = logoByNameMap[normName] || logoByNameMap[cleanName] || `https://flagcdn.com/w160/${countryCodeUpper.toLowerCase()}.png`;

          const langList = item.languages ? item.languages.map((l: string) => languageNameMap[l.toLowerCase()] || l.toUpperCase()).join(", ") : "Русский";

          allChannels.push({
            id: "famelack-" + item.nanoid,
            name: item.name,
            logo: matchedLogo,
            url: item.sources.streams[0],
            backupUrl: item.sources.streams[1] || "",
            embedUrl: "",
            category: mappedCategory,
            countryCode: countryCodeUpper,
            countryName: getCountryNameRu(countryCodeUpper),
            city: getCityRu(countryCodeUpper),
            language: langList,
            isHD: true,
            quality: "1080p",
            description: `Официальная прямая трансляция канала ${item.name} (${getCountryNameRu(countryCodeUpper)}).`
          });
        }
      } catch (e) {
        // Ignore single country error
      }
    }));
  }

  cachedFamelackChannels = allChannels;
  lastCacheTime = Date.now();
  console.log(`[Famelack TV API] Loaded ${allChannels.length} live channels from Famelack database across ${targetCountries.length} countries.`);
  return allChannels;
}

// Famelack Channels API Endpoint
app.get("/api/famelack/channels", async (req, res) => {
  try {
    if (!cachedFamelackChannels.length || Date.now() - lastCacheTime > CACHE_TTL) {
      await loadFamelackChannelsFromSource();
    }

    const { country, category, search, limit } = req.query;
    let filtered = [...cachedFamelackChannels];

    if (country && typeof country === "string" && country !== "ALL") {
      filtered = filtered.filter(c => c.countryCode.toLowerCase() === country.toLowerCase());
    }

    if (category && typeof category === "string" && category !== "all") {
      filtered = filtered.filter(c => c.category.toLowerCase() === category.toLowerCase());
    }

    if (search && typeof search === "string") {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(c => c.name.toLowerCase().includes(q) || c.countryName.toLowerCase().includes(q));
    }

    const maxLimit = limit ? parseInt(limit as string, 10) : 10000;
    res.json({
      total: filtered.length,
      channels: filtered.slice(0, maxLimit)
    });
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch Famelack channels: " + error.message });
  }
});

// Server-side CORS & HLS Proxy for 100% reliable TV broadcast streaming
app.get("/api/proxy-hls", async (req, res) => {
  const targetUrl = req.query.url as string;
  if (!targetUrl) {
    return res.status(400).send("Missing url parameter");
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "Connection": "keep-alive",
        "Referer": new URL(targetUrl).origin + "/",
      },
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).send(`Stream fetch failed: ${response.statusText}`);
    }

    const finalUrl = response.url || targetUrl;
    const contentType = response.headers.get("content-type") || "";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");

    if (
      targetUrl.includes(".m3u8") ||
      contentType.includes("mpegurl") ||
      contentType.includes("apple") ||
      contentType.includes("text")
    ) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      const text = await response.text();
      const baseUrl = finalUrl.substring(0, finalUrl.lastIndexOf("/") + 1);
      
      const parentUrlObj = new URL(finalUrl);
      const parentSearch = parentUrlObj.search;

      const lines = text.split("\n");
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/g, (_, p1) => {
              try {
                const fullObj = p1.startsWith("http") ? new URL(p1) : new URL(p1, baseUrl);
                if (!fullObj.search && parentSearch) fullObj.search = parentSearch;
                return `URI="/api/proxy-hls?url=${encodeURIComponent(fullObj.href)}"`;
              } catch {
                return `URI="${p1}"`;
              }
            });
          }
          return line;
        }
        try {
          const absoluteObj = trimmed.startsWith("http") ? new URL(trimmed) : new URL(trimmed, baseUrl);
          if (!absoluteObj.search && parentSearch) absoluteObj.search = parentSearch;
          return `/api/proxy-hls?url=${encodeURIComponent(absoluteObj.href)}`;
        } catch {
          return line;
        }
      });

      return res.send(rewrittenLines.join("\n"));
    } else {
      if (contentType) res.setHeader("Content-Type", contentType);
      res.setHeader("Cache-Control", "public, max-age=600");
      if (response.headers.get("content-length")) {
        res.setHeader("Content-Length", response.headers.get("content-length")!);
      }
      
      if (response.body) {
        const { Readable } = await import("stream");
        return Readable.fromWeb(response.body as any).pipe(res);
      } else {
        const arrayBuffer = await response.arrayBuffer();
        return res.send(Buffer.from(arrayBuffer));
      }
    }
  } catch (error: any) {
    console.error("Proxy HLS error:", error?.message || error);
    return res.status(500).send("Proxy error: " + (error?.message || "Stream timeout"));
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`manibuTV Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
