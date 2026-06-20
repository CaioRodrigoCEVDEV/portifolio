# ARCHITECTURE.md

## Visão geral
O projeto é um portfólio estático servido por um servidor Express mínimo. A UI vive em `public/` e o servidor só entrega os arquivos prontos e algumas rotas auxiliares.

## Estrutura principal
- `public/index.html`: página principal do portfólio.
- `public/obrigado.html`: tela de confirmação do formulário.
- `public/404.html`: página de erro personalizada.
- `public/assets/css/main.css`: tema, layout, componentes e responsividade.
- `public/assets/js/main.js`: interações da interface.
- `public/assets/img/`: imagens, screenshots e identidade visual.
- `src/index.js`: servidor Express e headers básicos.

## Fluxo de renderização
1. O navegador solicita `/` ou `/index`.
2. O servidor entrega `public/index.html`.
3. CSS e JS são carregados de `public/assets/`.
4. O JavaScript controla navegação móvel, estado do header, reveal on scroll e botão de voltar ao topo.

## Rotas
- `/` e `/index` -> `index.html`.
- `/thanks` -> redirect 301 para `/obrigado`.
- `/obrigado` -> `obrigado.html`.
- `/sitemap.xml` e `/robots.txt` -> arquivos estáticos.
- Qualquer outra rota -> `404.html`.

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
