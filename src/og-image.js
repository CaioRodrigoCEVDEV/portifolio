"use strict";

const path = require("path");
const { Resvg } = require("@resvg/resvg-js");

const FONTS = [
  path.resolve(__dirname, "..", "scripts", "fonts", "DejaVuSans-Bold.ttf"),
  path.resolve(__dirname, "..", "scripts", "fonts", "DejaVuSans.ttf"),
  path.resolve(__dirname, "..", "scripts", "fonts", "DejaVuSansMono.ttf")
];

const SEGMENTS = {
  geral: { label: "Presença digital", tagline: "Sites e catálogos para empresas" },
  celulares: { label: "Celulares", tagline: "Celulares, acessórios e assistência" },
  autopecas: { label: "Autopeças", tagline: "Catálogo de peças e orçamentos" },
  assistencias: { label: "Assistências", tagline: "Serviços, orçamentos e contato" }
};

const WIDTH = 1200;
const HEIGHT = 630;
const MAX_CACHE = 300;
const cache = new Map();

function isSegment(segmento) {
  return Object.prototype.hasOwnProperty.call(SEGMENTS, segmento);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Distribui o nome em 1 ou 2 linhas equilibradas.
function splitLines(name) {
  const words = name.split(/\s+/).filter(Boolean);
  if (words.length <= 1) return [name];
  let best = [name];
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ");
    const b = words.slice(i).join(" ");
    const diff = Math.abs(a.length - b.length);
    if (diff < bestDiff) {
      bestDiff = diff;
      best = [a, b];
    }
  }
  return best;
}

function buildSvg(segmento, empresa) {
  const tagline = SEGMENTS[segmento].tagline;
  const AW = 0.6; // largura média aproximada dos glifos
  const maxWidth = WIDTH - 160;
  const maxFont = 96;
  const minFont = 40;

  let lines = [empresa];
  let fontSize = Math.min(maxFont, Math.floor(maxWidth / Math.max(1, empresa.length * AW)));

  if (fontSize < minFont && empresa.includes(" ")) {
    lines = splitLines(empresa);
    const longest = Math.max(...lines.map(l => l.length));
    fontSize = Math.min(maxFont, Math.floor(maxWidth / Math.max(1, longest * AW)));
  }
  fontSize = Math.max(minFont, fontSize);

  const companyBaselines = lines.length === 1 ? [330] : [278, 368];
  const taglineY = lines.length === 1 ? 405 : 442;

  const companyText = lines
    .map((line, i) =>
      `<text x="80" y="${companyBaselines[i]}" font-family="DejaVu Sans" font-weight="bold" ` +
      `font-size="${fontSize}" fill="#f0fdf4">${escapeXml(line)}</text>`)
    .join("\n  ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="bg" cx="42%" cy="42%" r="80%">
      <stop offset="0%" stop-color="#123a24"/>
      <stop offset="100%" stop-color="#07110b"/>
    </radialGradient>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect x="80" y="140" width="140" height="7" fill="#22c55e"/>
  <text x="80" y="100" font-family="DejaVu Sans Mono" font-size="24" fill="#22c55e" letter-spacing="3">APRESENTAÇÃO</text>
  ${companyText}
  <text x="80" y="${taglineY}" font-family="DejaVu Sans" font-size="36" fill="#bbf7d0">${escapeXml(tagline)}</text>
  <text x="80" y="576" font-family="DejaVu Sans Mono" font-size="26" fill="#94b5a1">caiorodrigocev.com.br/apresentacao</text>
</svg>`;
}

function renderOgImage(segmento, empresa) {
  const key = `${segmento}|${empresa}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const resvg = new Resvg(buildSvg(segmento, empresa), {
    font: {
      fontFiles: FONTS,
      loadSystemFonts: false,
      defaultFontFamily: "DejaVu Sans"
    },
    fitTo: { mode: "width", value: WIDTH }
  });

  const png = resvg.render().asPng();

  if (cache.size >= MAX_CACHE) {
    cache.delete(cache.keys().next().value);
  }
  cache.set(key, png);
  return png;
}

module.exports = { renderOgImage, isSegment };
