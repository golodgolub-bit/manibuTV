import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "manibuTV" });
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
