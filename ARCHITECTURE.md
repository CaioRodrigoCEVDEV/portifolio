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
- `scripts/build-apresentacao.js`: config central dos segmentos e gerador das páginas.
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
- `/apresentacao` -> `apresentacao.html` (aceita `?segmento=...`, que redireciona 301 para a rota limpa, preservando `?empresa=`).
- `/apresentacao/celulares`, `/apresentacao/autopecas`, `/apresentacao/assistencias` -> páginas de segmento.
- `/sitemap.xml` e `/robots.txt` -> arquivos estáticos.
- Qualquer outra rota -> `404.html`.

## Personalização por lead
- O segmento é definido pela rota e chega à página por uma config JSON (`#presentation-config`) emitida pelo build.
- A empresa é opcional e vem da query string (`?empresa=...`), lida no client-side por `apresentacao.js`.
- A personalização altera apenas pontos de alto valor: frase da seção "Ideia para sua empresa", linha da demonstração e título do CTA final, além de links de WhatsApp e abas.
- A empresa fictícia da demo nunca é substituída pela empresa real; o nome aparece só como contexto.
- Inserção sempre via `textContent`, com normalização e limite de 60 caracteres (sem HTML vindo da URL).
- SEO: o canonical permanece na rota base do segmento e variantes com `?empresa=` recebem `X-Robots-Tag: noindex, follow` no servidor.
- Estrutura preparada para futuros campos de CRM (`cidade`, `telefone`, `whatsapp`, `site`, `instagram`, `score`, `mensagem`), ainda não implementados.

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
