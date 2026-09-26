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
  redirect: false,
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

const APRESENTACAO_SEGMENTOS = new Set(["celulares", "autopecas", "assistencias"]);

function sendApresentacao(req, res, file) {
  // Variantes personalizadas (?empresa=...) não devem ser indexadas.
  if (String(req.query.empresa || "").trim()) {
    res.setHeader("X-Robots-Tag", "noindex, follow");
  }
  res.sendFile(file);
}

app.get("/apresentacao", (req, res) => {
  const segmento = String(req.query.segmento || "").toLowerCase();
  if (APRESENTACAO_SEGMENTOS.has(segmento)) {
    const empresa = String(req.query.empresa || "");
    const query = empresa ? `?empresa=${encodeURIComponent(empresa)}` : "";
    return res.redirect(301, `/apresentacao/${segmento}${query}`);
  }
  sendApresentacao(req, res, path.join(ROOT, "apresentacao.html"));
});

app.get("/apresentacao/:segmento", (req, res) => {
  if (!APRESENTACAO_SEGMENTOS.has(req.params.segmento)) {
    return res.status(404).sendFile(path.join(ROOT, "404.html"));
  }
  sendApresentacao(req, res, path.join(ROOT, "apresentacao", `${req.params.segmento}.html`));
});

app.get("/snack-retro", (_req, res) =>
  res.sendFile(path.join(ROOT, "snack-retro", "index.html")));
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
