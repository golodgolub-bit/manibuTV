import express from "express";
import path from "path";
import zlib from "zlib";
import { createServer as createViteServer } from "vite";

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

let logoByNameMap: Record<string, string> = {};
let logoMapLoaded = false;

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
          const norm = c.name.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "");
          if (!logoByNameMap[norm]) logoByNameMap[norm] = logoUrl;
          
          const clean = c.name.toLowerCase().replace(/\b(hd|sd|live|tv|онлайн|канал)\b/gi, "").replace(/[^a-z0-9а-яё]/gi, "");
          if (clean && !logoByNameMap[clean]) logoByNameMap[clean] = logoUrl;

          if (c.alt_names && Array.isArray(c.alt_names)) {
            for (const alt of c.alt_names) {
              const normAlt = alt.toLowerCase().replace(/[^a-z0-9а-яё]/gi, "");
              if (!logoByNameMap[normAlt]) logoByNameMap[normAlt] = logoUrl;
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
  const c = code.toLowerCase();
  if (countryNames[c]) return countryNames[c];
  try {
    return regionNamesRu.of(code.toUpperCase()) || code.toUpperCase();
  } catch (e) {
    return code.toUpperCase();
  }
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
          const cleanName = item.name.toLowerCase().replace(/\b(hd|sd|live|tv|онлайн|канал)\b/gi, "").replace(/[^a-z0-9а-яё]/gi, "");
          const countryCodeUpper = (item.country || cc).toUpperCase();

          const matchedLogo = logoByNameMap[normName] || logoByNameMap[cleanName] || `https://flagcdn.com/w160/${countryCodeUpper.toLowerCase()}.png`;

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
            language: item.languages ? item.languages.join(", ") : "Русский / English",
            isHD: true,
            quality: "1080p",
            description: `Официальная прямая трансляция канала ${item.name} в высоком качестве.`
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
    const timeout = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
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

      const lines = text.split("\n");
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/g, (_, p1) => {
              try {
                const full = p1.startsWith("http") ? p1 : new URL(p1, baseUrl).href;
                return `URI="/api/proxy-hls?url=${encodeURIComponent(full)}"`;
              } catch {
                return `URI="${p1}"`;
              }
            });
          }
          return line;
        }
        try {
          const absoluteUrl = trimmed.startsWith("http") ? trimmed : new URL(trimmed, baseUrl).href;
          return `/api/proxy-hls?url=${encodeURIComponent(absoluteUrl)}`;
        } catch {
          return line;
        }
      });

      return res.send(rewrittenLines.join("\n"));
    } else {
      if (contentType) res.setHeader("Content-Type", contentType);
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
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
