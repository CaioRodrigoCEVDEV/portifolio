# PROJECT_RULES.md

## Regras gerais
- Não introduzir frameworks de UI.
- Preferir HTML, CSS e JavaScript vanilla.
- Evitar dependências novas sem necessidade concreta.
- Não editar `node_modules/`.
- Não alterar copy, ordem ou estrutura sem pedido explícito.
- Não fazer commit automaticamente.

## Conteúdo e SEO
- Preservar meta tags, Open Graph, Twitter Cards e JSON-LD.
- Manter `alt` em imagens e `aria-*` quando fizer sentido.
- Garantir que links externos abram em nova aba com `rel="noopener noreferrer"`.

## Estrutura e manutenção
- `public/` é a saída pronta para produção.
- `src/index.js` deve continuar apenas servindo arquivos estáticos e páginas auxiliares.
- Manter a seção de projetos com o primeiro item sendo a Calculadora Fiscal Brasil.
- Preferir a menor alteração que resolva o problema.

## Qualidade
- Validar desktop, tablet e mobile antes de finalizar.
- Verificar se a navegação continua funcionando.
- Não mencionar tecnologias ou servidores que não estejam no código.
