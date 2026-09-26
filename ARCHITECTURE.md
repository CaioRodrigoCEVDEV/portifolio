# ARCHITECTURE.md

## Visão geral
O projeto é um portfólio estático servido por um servidor Express mínimo. A UI vive em `public/` e o servidor só entrega os arquivos prontos e algumas rotas auxiliares.

## Estrutura principal
- `public/index.html`: página principal do portfólio.
- `public/apresentacao.html`: apresentação comercial (versão genérica) e template dos segmentos.
- `public/apresentacao/*.html`: versões por segmento (celulares, autopeças, assistências), geradas por `scripts/build-apresentacao.js`.
- `public/obrigado.html`: tela de confirmação do formulário.
- `public/404.html`: página de erro personalizada.
- `public/assets/css/main.css`: tema, layout, componentes e responsividade.
- `public/assets/js/main.js`: interações da interface.
- `public/assets/js/apresentacao.js`: personalização da apresentação por lead (`?empresa=...`).
- `public/assets/img/`: imagens, screenshots e identidade visual.
- `public/assets/img/og/`: imagens Open Graph por segmento (`build-og-images.sh`).
- `scripts/build-apresentacao.js`: config central dos segmentos e gerador das páginas.
- `scripts/build-og-images.sh`: gera as imagens OG (requer ImageMagick, não roda em produção).
- `scripts/fonts/`: fontes DejaVu usadas na geração da imagem OG personalizada.
- `scripts/deploy.sh`: script de deploy de produção (parar -> git pull -> npm ci -> iniciar).
- `.github/workflows/deploy-ssh.yml`: workflow que executa `scripts/deploy.sh` no servidor via SSH.
- `src/og-image.js`: gera o PNG Open Graph com o nome do lead (SVG -> PNG via `@resvg/resvg-js`).
- `src/index.js`: servidor Express, headers básicos e personalização server-side.

## Fluxo de renderização
1. O navegador solicita `/` ou `/index`.
2. O servidor entrega `public/index.html`.
3. CSS e JS são carregados de `public/assets/`.
4. O JavaScript controla navegação móvel, estado do header, reveal on scroll e botão de voltar ao topo.

## Rotas
- `/` e `/index` -> `index.html`.
- `/thanks` -> redirect 301 para `/obrigado`.
- `/obrigado` -> `obrigado.html`.
- `/apresentacao` -> `apresentacao.html` (aceita `?segmento=...`, que redireciona 301 para a rota limpa, preservando `?empresa=`).
- `/apresentacao/celulares`, `/apresentacao/autopecas`, `/apresentacao/assistencias` -> páginas de segmento.
- `/og/:segmento/:empresa.png` -> imagem Open Graph personalizada (gerada em runtime; `noindex`).
- `/sitemap.xml` e `/robots.txt` -> arquivos estáticos.
- Qualquer outra rota -> `404.html`.

## Personalização por lead
- O segmento é definido pela rota e chega à página por uma config JSON (`#presentation-config`) emitida pelo build.
- A empresa é opcional e vem da query string (`?empresa=...`), lida no client-side por `apresentacao.js`.
- Empresa e segmento são independentes: o segmento controla produtos/categorias; a empresa controla a identificação visual.
- Pontos personalizados: linha contextual no hero, frase da seção "Ideia para sua empresa", linha da demonstração, título do CTA e links de WhatsApp.
- A troca de segmento é feita apenas por URL (ex.: `/apresentacao/assistencias`); não há botões/abas na tela.
- A demonstração é uma simulação: nome, domínio (`www.<slug>.com.br`) e e-mail (`contato@<slug>.com.br`) são ilustrativos, com legendas de "ilustrativo" e sem afirmar disponibilidade do domínio.
- Funções centrais em `apresentacao.js`: `normalizeCompanyName`, `companyToSlug`, `companyToDomain`, `companyToEmail`, `companyInitials`.
- Inserção sempre via `textContent`, com normalização, remoção de acentos/caracteres inválidos e limite de 60 caracteres (sem HTML vindo da URL).
- Meta tags de preview: quando há `?empresa=`, o servidor (`personalizeHead` em `src/index.js`) injeta `<title>`, `og:title/description/url/image:alt` e `twitter:*` com o nome da empresa. Isso é necessário porque o crawler do WhatsApp/Facebook não executa JavaScript. O valor é escapado (`escapeHtml`) e o HTML é cacheado em memória por arquivo/mtime. Sem `?empresa=`, o arquivo estático é servido sem alteração.
- Imagens Open Graph: uma estática por segmento em `public/assets/img/og/*.png` (1200x630), usada quando não há `?empresa=`.
- Imagem OG personalizada: com `?empresa=`, o servidor aponta `og:image`/`twitter:image` para `/og/<segmento>/<empresa>.png`, gerada em runtime por `src/og-image.js` (`@resvg/resvg-js` + fontes em `scripts/fonts/`), com cache em memória e fallback para a imagem estática. Exige `npm ci` no deploy.
- SEO: o canonical permanece na rota base do segmento e variantes com `?empresa=` recebem `X-Robots-Tag: noindex, follow` no servidor.
- Estrutura preparada para futuros campos de CRM (`cidade`, `telefone`, `whatsapp`, `site`, `instagram`, `score`, `mensagem`), ainda não implementados.

## Deploy
- Um push na `main` dispara o workflow `deploy-ssh.yml`, que abre SSH no servidor e executa `scripts/deploy.sh` (enviado via `bash -s`).
- O script: `systemctl stop` -> `git pull --ff-only origin main` -> `npm ci --omit=dev` -> `systemctl start`, com `trap` para religar o serviço mesmo em caso de falha.
- Pode ser executado manualmente no servidor, a partir da raiz do projeto.

## UI sections
- Hero com apresentação principal e card de perfil.
- Sobre com texto e stack.
- Projetos com cards em grid.
- Trajetória em formato de timeline.
- Contato com links e formulário.

## Comportamento do JS
- Marca o header como rolado ao descer a página.
- Destaca o link ativo no menu conforme a seção visível.
- Controla o menu mobile.
- Revela elementos com `IntersectionObserver`.
- Exibe o botão de voltar ao topo.
