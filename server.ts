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
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
        "Accept": "*/*",
      },
    });

    if (!response.ok) {
      return res.status(response.status).send(`Stream fetch failed: ${response.statusText}`);
    }

    const contentType = response.headers.get("content-type") || "";

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "*");

    if (targetUrl.includes(".m3u8") || contentType.includes("mpegurl") || contentType.includes("apple") || contentType.includes("text")) {
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      const text = await response.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf("/") + 1);

      const lines = text.split("\n");
      const rewrittenLines = lines.map((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) {
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/g, (_, p1) => {
              const full = p1.startsWith("http") ? p1 : new URL(p1, baseUrl).href;
              return `URI="/api/proxy-hls?url=${encodeURIComponent(full)}"`;
            });
          }
          return line;
        }
        const absoluteUrl = trimmed.startsWith("http") ? trimmed : new URL(trimmed, baseUrl).href;
        return `/api/proxy-hls?url=${encodeURIComponent(absoluteUrl)}`;
      });

      return res.send(rewrittenLines.join("\n"));
    } else {
      if (contentType) res.setHeader("Content-Type", contentType);
      const arrayBuffer = await response.arrayBuffer();
      return res.send(Buffer.from(arrayBuffer));
    }
  } catch (error: any) {
    console.error("Proxy HLS error:", error);
    return res.status(500).send("Proxy error: " + error.message);
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
