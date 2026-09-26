"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PUBLIC = path.join(ROOT, "public");
const TEMPLATE = path.join(PUBLIC, "apresentacao.html");
const OUT_DIR = path.join(PUBLIC, "apresentacao");

const SEGMENTS = [
  {
    slug: "celulares",
    path: "/apresentacao/celulares",
    title: "Sites e catálogos para lojas e assistências de celulares | Caio Rodrigo",
    description: "Sites e catálogos para lojas e assistências de celulares: apresente acessórios, serviços de conserto e facilite o contato com clientes pelo WhatsApp.",
    keywords: "site para assistência de celular, catálogo de acessórios, site para loja de celulares, presença digital, whatsapp",
    serviceName: "Sites e catálogos para lojas e assistências de celulares",
    serviceType: "Criação de sites, catálogos e presença digital para o setor de celulares",
    serviceDescription: "Criação de sites e catálogos para lojas e assistências de celulares que querem apresentar acessórios, serviços de conserto e facilitar o orçamento pelo WhatsApp.",
    breadcrumbName: "Celulares",
    segmentPhrase: "de celulares",
    waText: "Gostei da apresentação, vamos conversar!",
    demo: {
      brand: "TechCell",
      initials: "TC",
      site: "www.techcell.com.br",
      tagline: "Celulares, acessórios e assistência",
      nav: ["Início", "Serviços", "Contato"],
      kicker: "Atendimento rápido",
      bannerTitle: "Seu celular novo de novo, com conserto e acessórios.",
      bannerCta: "Ver serviços",
      categories: ["Acessórios", "Películas", "Capas", "Assistência"],
      products: [
        ["Película de vidro", "R$ 29,90"],
        ["Carregador turbo", "R$ 79,90"],
        ["Troca de tela", "a partir de R$ 249"]
      ],
      address: "Av. Central, 450 &mdash; Loja 2",
      hours: "Seg a Sáb &middot; 9h às 19h",
      phone: "(00) 90000-0000"
    }
  },
  {
    slug: "autopecas",
    path: "/apresentacao/autopecas",
    title: "Sites e catálogos para lojas de autopeças | Caio Rodrigo",
    description: "Sites e catálogos para lojas de autopeças: apresente peças, organize categorias e facilite orçamentos com clientes pelo WhatsApp.",
    keywords: "site para autopeças, catálogo de peças, site para loja de peças, presença digital, whatsapp",
    serviceName: "Sites e catálogos para lojas de autopeças",
    serviceType: "Criação de sites, catálogos e presença digital para autopeças",
    serviceDescription: "Criação de sites e catálogos para lojas de autopeças que querem apresentar peças, organizar categorias e agilizar orçamentos pelo WhatsApp.",
    breadcrumbName: "Autopeças",
    segmentPhrase: "de autopeças",
    waText: "Gostei da apresentação, vamos conversar!",
    demo: {
      brand: "AutoPeças Prime",
      initials: "AP",
      site: "www.autopecasprime.com.br",
      tagline: "Peças, motor, freios e suspensão",
      nav: ["Início", "Peças", "Contato"],
      kicker: "Peça certa, sem enrolação",
      bannerTitle: "Encontre a peça ideal com atendimento de confiança.",
      bannerCta: "Ver peças",
      categories: ["Motor", "Suspensão", "Elétrica", "Freios"],
      products: [
        ["Filtro de óleo", "R$ 39,90"],
        ["Pastilha de freio", "R$ 129,90"],
        ["Amortecedor", "R$ 289,90"]
      ],
      address: "Rod. BR-040, km 12 &mdash; Galpão 5",
      hours: "Seg a Sex &middot; 8h às 18h",
      phone: "(00) 90000-0000"
    }
  },
  {
    slug: "assistencias",
    path: "/apresentacao/assistencias",
    title: "Sites e catálogos para assistências técnicas | Caio Rodrigo",
    description: "Sites e catálogos para assistências técnicas: apresente serviços, marcas atendidas e facilite orçamentos com clientes pelo WhatsApp.",
    keywords: "site para assistência técnica, catálogo de serviços, assistência de eletrônicos, presença digital, whatsapp",
    serviceName: "Sites e catálogos para assistências técnicas",
    serviceType: "Criação de sites, catálogos e presença digital para assistências técnicas",
    serviceDescription: "Criação de sites e catálogos para assistências técnicas que querem apresentar serviços, organizar informações e facilitar orçamentos pelo WhatsApp.",
    breadcrumbName: "Assistências",
    segmentPhrase: "de assistência técnica",
    waText: "Gostei da apresentação, vamos conversar!",
    demo: {
      brand: "AssistTec",
      initials: "AT",
      site: "www.assisttec.com.br",
      tagline: "Conserto de eletrônicos e eletrodomésticos",
      nav: ["Início", "Serviços", "Contato"],
      kicker: "Conserto especializado",
      bannerTitle: "Conserto com agilidade e garantia no serviço.",
      bannerCta: "Ver serviços",
      categories: ["Geladeiras", "Máquinas de lavar", "TVs", "Micro-ondas"],
      products: [
        ["Conserto de geladeira", "a partir de R$ 180"],
        ["Troca de placa", "a partir de R$ 250"],
        ["Instalação de TV", "R$ 120"]
      ],
      address: "Rua das Oficinas, 88 &mdash; Centro",
      hours: "Seg a Sáb &middot; 8h às 18h",
      phone: "(00) 90000-0000"
    }
  }
];

function jsonBlock(value) {
  return JSON.stringify(value, null, 2)
    .split("\n")
    .map(line => `  ${line}`)
    .join("\n");
}

function headBlock(seg) {
  const ogImage = `https://caiorodrigocev.com.br/assets/img/og/${seg.slug}.png`;
  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: seg.serviceName,
    serviceType: seg.serviceType,
    description: seg.serviceDescription,
    url: `https://caiorodrigocev.com.br${seg.path}`,
    inLanguage: "pt-BR",
    provider: {
      "@type": "Person",
      name: "Caio Rodrigo",
      jobTitle: "Desenvolvedor",
      url: "https://caiorodrigocev.com.br/",
      image: "https://caiorodrigocev.com.br/assets/img/my-profile-img.jpg",
      telephone: "+55-61-99519-4930",
      email: "mailto:contato@caiorodrigocev.com.br",
      sameAs: [
        "https://www.linkedin.com/in/caio-rodrigo-17a502330/",
        "https://github.com/CaioRodrigoCEVDEV"
      ]
    },
    areaServed: { "@type": "Country", name: "Brasil" },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Soluções digitais para empresas",
      itemListElement: [
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Site institucional" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Catálogo de produtos" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Domínio próprio e e-mail profissional" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Integração com WhatsApp" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Presença local e Google Maps" } },
        { "@type": "Offer", itemOffered: { "@type": "Service", name: "Manutenção e suporte" } }
      ]
    }
  };

  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: "https://caiorodrigocev.com.br/" },
      { "@type": "ListItem", position: 2, name: "Apresentação", item: "https://caiorodrigocev.com.br/apresentacao" },
      { "@type": "ListItem", position: 3, name: seg.breadcrumbName, item: `https://caiorodrigocev.com.br${seg.path}` }
    ]
  };

  return `  <title>${seg.title}</title>
  <meta name="description" content="${seg.description}">
  <meta name="keywords" content="${seg.keywords}">
  <meta name="author" content="Caio Rodrigo">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="googlebot" content="index, follow">
  <link rel="canonical" href="https://caiorodrigocev.com.br${seg.path}">

  <meta property="og:type" content="website">
  <meta property="og:locale" content="pt_BR">
  <meta property="og:site_name" content="Caio Rodrigo">
  <meta property="og:title" content="${seg.title}">
  <meta property="og:description" content="${seg.description}">
  <meta property="og:url" content="https://caiorodrigocev.com.br${seg.path}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="Apresentação de presença digital — ${seg.breadcrumbName}">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${seg.title}">
  <meta name="twitter:description" content="${seg.description}">
  <meta name="twitter:image" content="${ogImage}">
  <meta name="twitter:creator" content="@caiorodrigocev">

  <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon.png">
  <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
  <link rel="stylesheet" href="/assets/css/main.css?v=5">

  <script type="application/ld+json">
${jsonBlock(service)}
  </script>

  <script type="application/ld+json">
${jsonBlock(breadcrumb)}
  </script>`;
}

function configBlock(seg) {
  const config = {
    segment: seg.slug,
    label: seg.breadcrumbName,
    segmentPhrase: seg.segmentPhrase,
    waText: seg.waText
  };
  return `  <script type="application/json" id="presentation-config">${JSON.stringify(config)}</script>`;
}

function demoBlock(demo) {
  const nav = demo.nav.map(item => `                  <span>${item}</span>`).join("\n");
  const categories = demo.categories.map(item => `                <span>${item}</span>`).join("\n");
  const products = demo.products.map(([name, price]) => `                <article class="presentation-demo-product">
                  <span class="presentation-demo-thumb" aria-hidden="true"></span>
                  <span class="presentation-demo-product-name">${name}</span>
                  <span class="presentation-demo-product-price">${price}</span>
                  <span class="presentation-demo-product-cta">Pedir no WhatsApp</span>
                </article>`).join("\n");

  return `        <div class="presentation-demo-wrap reveal">
          <div class="presentation-demo" role="img" aria-label="Exemplo ilustrativo de site, com cabeçalho, destaque, categorias, produtos, contato e botão de WhatsApp">
            <div class="presentation-demo-bar">
              <span class="presentation-demo-dots" aria-hidden="true"><i></i><i></i><i></i></span>
              <span class="presentation-demo-url" data-demo-domain>${demo.site}</span>
            </div>

            <div class="presentation-demo-site">
              <div class="presentation-demo-header">
                <span class="presentation-demo-logo">
                  <span aria-hidden="true" data-demo-initials>${demo.initials}</span>
                  <span class="presentation-demo-brand-wrap">
                    <span class="presentation-demo-brand" data-demo-brand>${demo.brand}</span>
                    <span class="presentation-demo-tagline">${demo.tagline}</span>
                  </span>
                </span>
                <nav class="presentation-demo-nav" aria-hidden="true">
${nav}
                </nav>
                <span class="presentation-demo-wa"><i class="bi bi-whatsapp"></i> WhatsApp</span>
              </div>

              <div class="presentation-demo-banner">
                <span class="presentation-demo-banner-kicker">${demo.kicker}</span>
                <p class="presentation-demo-banner-title">${demo.bannerTitle}</p>
                <span class="presentation-demo-banner-cta">${demo.bannerCta}</span>
              </div>

              <div class="presentation-demo-cats" aria-hidden="true">
${categories}
              </div>

              <div class="presentation-demo-products">
${products}
              </div>

              <div class="presentation-demo-footer">
                <span><i class="bi bi-geo-alt" aria-hidden="true"></i> ${demo.address}</span>
                <span><i class="bi bi-clock" aria-hidden="true"></i> ${demo.hours}</span>
                <span><i class="bi bi-whatsapp" aria-hidden="true"></i> ${demo.phone}</span>
              </div>
            </div>
          </div>
          <p class="presentation-demo-note">Demonstração ilustrativa. Cada projeto é criado com a identidade e as informações da sua empresa.</p>
        </div>`;
}

function replaceBlock(source, name, content) {
  const re = new RegExp(`<!-- BUILD:${name} -->[\\s\\S]*?<!-- /BUILD:${name} -->`);
  if (!re.test(source)) throw new Error(`Marcador BUILD:${name} não encontrado no template.`);
  return source.replace(re, `<!-- BUILD:${name} -->\n${content}\n<!-- /BUILD:${name} -->`);
}

function build() {
  const template = fs.readFileSync(TEMPLATE, "utf8");

  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  const written = [];
  for (const seg of SEGMENTS) {
    let out = replaceBlock(template, "HEAD", headBlock(seg));
    out = replaceBlock(out, "CONFIG", configBlock(seg));
    out = replaceBlock(out, "DEMO", demoBlock(seg.demo));
    const file = path.join(OUT_DIR, `${seg.slug}.html`);
    fs.writeFileSync(file, out);
    written.push(path.relative(ROOT, file));
  }

  console.log("Páginas de segmento geradas:");
  written.forEach(f => console.log(`  - ${f}`));
}

build();
