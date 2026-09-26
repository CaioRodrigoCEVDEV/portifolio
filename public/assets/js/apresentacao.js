/*
 * Personalização da apresentação comercial.
 *
 * Parâmetros suportados hoje (client-side, via query string):
 *   - empresa: nome do lead, opcional (ex.: ?empresa=Smartcell)
 *
 * O segmento continua definido pela rota (/apresentacao/celulares etc.) e
 * chega à página pela config JSON emitida no build (scripts/build-apresentacao.js).
 *
 * Preparado para o futuro CRM (ainda não implementado no front):
 *   { empresa, segmento, cidade, telefone, whatsapp, site, instagram, score, mensagem }
 * Os campos extras devem entrar pela mesma config/parametrização, sempre com
 * inserção segura (textContent) e limite de tamanho.
 */
(() => {
  "use strict";

  const MAX_EMPRESA = 60;
  const WHATSAPP_BASE = "https://wa.me/5561995194930";

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

  // Texto de abertura da seção de personalização (sempre, por segmento).
  const intro = $("[data-personal-intro]");
  if (intro) {
    intro.textContent =
      "Esta apresentação mostra como uma empresa " + segmentPhrase +
      " pode organizar sua presença digital em um endereço próprio.";
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

  const params = new URLSearchParams(window.location.search);
  const empresa = normalizeEmpresa(params.get("empresa"));

  // Sem empresa: a página permanece genérica (nada de identificação dinâmica).
  if (!empresa) return;

  document.body.dataset.empresa = empresa;

  // Nome da empresa: sempre via textContent (nunca innerHTML).
  $$("[data-company-name]").forEach(el => {
    el.textContent = empresa;
  });

  // Elementos que só fazem sentido quando há empresa.
  $$("[data-company-only]").forEach(el => {
    el.hidden = false;
  });

  // Título contextual do CTA final.
  const ctaTitle = $("[data-cta-title]");
  if (ctaTitle) ctaTitle.textContent = "Vamos colocar a " + empresa + " na internet?";

  // Abas de segmento mantêm a empresa ao alternar.
  $$(".presentation-segment-tab").forEach(tab => {
    try {
      const url = new URL(tab.getAttribute("href"), window.location.origin);
      url.searchParams.set("empresa", empresa);
      tab.setAttribute("href", url.pathname + "?" + url.searchParams.toString());
    } catch (_) {
      /* href inválido: mantém o original */
    }
  });

  // WhatsApp: mesma estrutura, com mensagem curta quando há empresa.
  const waText = String(config.waText || "")
    .replace(/\{empresa\}/g, empresa)
    .replace(/\{segmento\}/g, config.label || "");

  if (waText) {
    const href = WHATSAPP_BASE + "?text=" + encodeURIComponent(waText);
    $$('a[href^="' + WHATSAPP_BASE + '"]').forEach(a => a.setAttribute("href", href));
  }
})();
