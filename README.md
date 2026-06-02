# Portfólio — Caio Rodrigo

Portfólio pessoal e profissional, com foco em **performance, SEO e arquitetura limpa**.

🔗 Produção: [caiorodrigocev.com.br](https://caiorodrigocev.com.br/)

## Stack

- HTML5 semântico
- CSS3 moderno (variáveis, container queries, dark mode nativo, `prefers-reduced-motion`)
- JavaScript vanilla (sem frameworks)
- Node.js + Express (apenas para servir arquivos estáticos)

## Estrutura

```
.
├── public/                # Site estático (deploy-ready)
│   ├── index.html         # Página principal
│   ├── obrigado.html      # Página de agradecimento
│   ├── 404.html           # Página de erro
│   ├── sitemap.xml
│   ├── robots.txt
│   ├── site.webmanifest
│   └── assets/
│       ├── css/main.css
│       ├── js/main.js
│       ├── img/
│       └── vendor/bootstrap-icons/
├── src/index.js           # Servidor Express mínimo
└── package.json
```

## Scripts

```bash
npm install   # instala dependências
npm start     # roda em http://localhost:3003
```

## SEO

- Meta tags completas (`description`, `keywords`, `robots`, `canonical`)
- Open Graph + Twitter Cards
- JSON-LD com schema `Person` e `WebSite`
- `sitemap.xml` e `robots.txt`
- HTML semântico, `aria-*`, hierarquia de headings, `alt` em imagens
- `preload` de imagem crítica e fonts com `display=swap`

## Performance

- Zero dependências de UI (sem Bootstrap, jQuery, etc.)
- IntersectionObserver para reveal sob demanda
- CSS com `contain`, `content-visibility` quando aplicável
- Cache de estáticos com `immutable` para imagens/fontes

## Contato

- E-mail: [contato@caiorodrigocev.com.br](mailto:contato@caiorodrigocev.com.br)
- LinkedIn: [caio-rodrigo-17a502330](https://www.linkedin.com/in/caio-rodrigo-17a502330/)
