/*
 * Personalização da apresentação comercial.
 *
 * Parâmetros suportados hoje (client-side, via query string):
 *   - empresa: nome do lead, opcional (ex.: ?empresa=Smartcell)
 *
 * O segmento continua definido pela rota (/apresentacao/celulares etc.) e
 * chega à página pela config JSON emitida no build (scripts/build-apresentacao.js).
 * Empresa e segmento são dimensões independentes: o segmento define produtos e
 * categorias; a empresa define apenas a identificação visual (nome, domínio e
 * e-mail ilustrativos), sempre de forma demonstrativa.
 *
 * Preparado para o futuro CRM (ainda não implementado no front):
 *   { empresa, segmento, cidade, telefone, whatsapp, site, instagram, score, mensagem }
 * Os campos extras devem entrar pela mesma parametrização, sempre com inserção
 * segura (textContent) e limite de tamanho.
 */
(() => {
  "use strict";

  const MAX_EMPRESA = 60;
  const MAX_SLUG = 30;
  const WHATSAPP_BASE = "https://wa.me/5561995194930";
  const STOPWORDS = new Set(["de", "da", "do", "das", "dos", "e", "em", "para"]);

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  let config = {};
  try {
    const el = document.getElementById("presentation-config");
    if (el) config = JSON.parse(el.textContent || "{}") || {};
  } catch (_) {
    config = {};
  }

  const segmentPhrase = config.segmentPhrase || "do seu segmento";
  document.body.dataset.segment = config.segment || "geral";

  /* ---------- Funções reutilizáveis de normalização ---------- */

  // Nome de exibição: sem caracteres de controle, espaços normalizados e limite.
  function normalizeCompanyName(raw) {
    if (!raw) return "";
    let value = String(raw)
      .replace(/[\u0000-\u001F\u007F]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (value.length > MAX_EMPRESA) value = value.slice(0, MAX_EMPRESA).trim();
    return value;
  }

  // Identificador para domínio/e-mail: sem acentos, minúsculo, só [a-z0-9].
  function companyToSlug(name) {
    const base = String(name || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "");
    return base.slice(0, MAX_SLUG);
  }

  function companyToDomain(name) {
    return "www." + (companyToSlug(name) || "suaempresa") + ".com.br";
  }

  function companyToEmail(name) {
    return "contato@" + (companyToSlug(name) || "suaempresa") + ".com.br";
  }

  // Iniciais para o logotipo da demonstração (até 2 letras).
  function companyInitials(name) {
    const words = String(name || "")
      .split(/\s+/)
      .map(w => w.replace(/[^\p{L}\p{N}]/gu, ""))
      .filter(w => w && !STOPWORDS.has(w.toLowerCase()));
    if (!words.length) return "EX";
    if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  }

  /* ---------- Texto de abertura (sempre, por segmento) ---------- */

  const intro = $("[data-personal-intro]");
  if (intro) {
    intro.textContent =
      "Esta apresentação mostra como uma empresa " + segmentPhrase +
      " pode organizar sua presença digital em um endereço próprio.";
  }

  const params = new URLSearchParams(window.location.search);
  const empresa = normalizeCompanyName(params.get("empresa"));

  // Sem empresa: a página permanece genérica (sem identificação dinâmica).
  if (!empresa) return;

  document.body.dataset.empresa = empresa;

  /* ---------- Identificação da empresa (inserção via textContent) ---------- */

  $$("[data-company-name]").forEach(el => {
    el.textContent = empresa;
  });

  $$("[data-company-only]").forEach(el => {
    el.hidden = false;
  });

  const example = $("[data-personal-example]");
  if (example) {
    example.textContent = "Pensamos este exemplo considerando a " + empresa + ".";
  }

  /* ---------- Demonstração (mockup) ---------- */

  const domain = companyToDomain(empresa);
  const email = companyToEmail(empresa);

  $$("[data-demo-domain]").forEach(el => {
    el.textContent = domain;
  });
  $$("[data-demo-email]").forEach(el => {
    el.textContent = email;
  });
  $$("[data-demo-brand]").forEach(el => {
    el.textContent = empresa;
  });
  $$("[data-demo-initials]").forEach(el => {
    el.textContent = companyInitials(empresa);
  });

  /* ---------- CTA final ---------- */

  const ctaTitle = $("[data-cta-title]");
  if (ctaTitle) ctaTitle.textContent = "Vamos colocar a " + empresa + " na internet?";

  /* ---------- WhatsApp: mesma estrutura, com mensagem curta ---------- */

  const waText = String(config.waText || "")
    .replace(/\{empresa\}/g, empresa)
    .replace(/\{segmento\}/g, config.label || "");

  if (waText) {
    const href = WHATSAPP_BASE + "?text=" + encodeURIComponent(waText);
    $$('a[href^="' + WHATSAPP_BASE + '"]').forEach(a => a.setAttribute("href", href));
  }
})();
