const fs = require("fs");
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
    if (/\.(?:css|js)$/i.test(file)) {
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
const SITE_URL = "https://caiorodrigocev.com.br";
const MAX_EMPRESA = 60;

// Cache do HTML em memória, invalidado pela data de modificação do arquivo.
const htmlCache = new Map();
function readHtml(file) {
  const mtime = fs.statSync(file).mtimeMs;
  const key = `${file}:${mtime}`;
  const cached = htmlCache.get(key);
  if (cached) return cached;
  const content = fs.readFileSync(file, "utf8");
  for (const k of htmlCache.keys()) {
    if (k.startsWith(`${file}:`)) htmlCache.delete(k);
  }
  htmlCache.set(key, content);
  return content;
}

function normalizeEmpresa(raw) {
  if (!raw) return "";
  let value = String(raw)
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (value.length > MAX_EMPRESA) value = value.slice(0, MAX_EMPRESA).trim();
  return value;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Injeta title/Open Graph/Twitter com o nome da empresa. Necessário porque o
// crawler do WhatsApp/Facebook não executa JavaScript.
function personalizeHead(html, empresa, url) {
  const safe = escapeHtml(empresa);
  const title = `${safe} — Apresentação`;
  const description = `Uma ideia de presença digital pensada para a ${safe}. Exemplo ilustrativo.`;
  const setMeta = (source, attr, value) =>
    source.replace(new RegExp(`(<meta[^>]*${attr}[^>]*content=")[^"]*(")`), `$1${value}$2`);

  let out = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  out = setMeta(out, 'property="og:title"', title);
  out = setMeta(out, 'name="twitter:title"', title);
  out = setMeta(out, 'property="og:description"', description);
  out = setMeta(out, 'name="twitter:description"', description);
  out = setMeta(out, 'property="og:url"', escapeHtml(url));
  out = setMeta(out, 'property="og:image:alt"', `Presença digital para ${safe}`);
  return out;
}

function sendApresentacao(req, res, file) {
  const empresa = normalizeEmpresa(req.query.empresa);

  // Sem empresa: serve o arquivo estático exatamente como antes.
  if (!empresa) return res.sendFile(file);

  // Variantes personalizadas (?empresa=...) não devem ser indexadas.
  res.setHeader("X-Robots-Tag", "noindex, follow");
  res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");

  const url = `${SITE_URL}${req.path}?empresa=${encodeURIComponent(empresa)}`;
  res.type("html").send(personalizeHead(readHtml(file), empresa, url));
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
