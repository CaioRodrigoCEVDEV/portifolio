const path = require("path");
const express = require("express");
require("dotenv").config();

const app = express();
const PORT = Number(process.env.PORT || process.env.port) || 3003;
const ROOT = path.resolve(__dirname, "..", "public");

app.disable("x-powered-by");
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
  next();
});

app.use(express.static(ROOT, {
  maxAge: "7d",
  immutable: false,
  etag: true,
  setHeaders(res, file) {
    if (/\.(?:png|jpg|jpeg|webp|svg|woff2?|ttf|otf)$/i.test(file)) {
      res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
    }
    if (file.endsWith(".html")) {
      res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
    }
  }
}));

["/", "/index"].forEach(route => {
  app.get(route, (_req, res) => res.sendFile(path.join(ROOT, "index.html")));
});

app.get("/thanks", (_req, res) => res.redirect(301, "/obrigado"));
app.get("/obrigado", (_req, res) => res.sendFile(path.join(ROOT, "obrigado.html")));

app.get("/snack-retro/politica-de-privacidade", (_req, res) =>
  res.sendFile(path.join(ROOT, "snack-retro", "politica-de-privacidade.html")));

app.get("/sitemap.xml", (_req, res) => res.type("application/xml").sendFile(path.join(ROOT, "sitemap.xml")));
app.get("/robots.txt",   (_req, res) => res.type("text/plain").sendFile(path.join(ROOT, "robots.txt")));

app.use((_req, res) => {
  res.status(404).sendFile(path.join(ROOT, "404.html"));
});

app.listen(PORT, () => {
  console.log(`Portfólio rodando em http://localhost:${PORT}`);
});
