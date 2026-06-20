# DESIGN.md

## Direção visual
- Tema escuro com base verde, contraste alto e aparência profissional.
- Fundo principal em verde muito escuro, com gradientes sutis e brilho controlado.
- Bordas finas, sombras suaves e cantos arredondados.
- Visual limpo, técnico e coerente com produto em produção.

## Tipografia
- Títulos: `Space Grotesk`.
- Texto e UI: `Inter`.
- Labels técnicos e chips: `JetBrains Mono`.

## Componentes
- `btn`: botão principal/ghost com formato pill.
- `tag`: selo pequeno para status e metadados.
- `chip`: badge de tecnologia ou categoria.
- `project`: card de projeto com cover 16:9 e corpo abaixo.

## Seção de projetos
- O preview deve existir sempre no topo do card.
- A altura do cover deve seguir a proporção visual dos demais cards.
- O card em destaque pode receber sombra extra, mas não deve parecer um componente diferente.
- O selo de status deve ficar separado do título e da descrição.
- Em mobile, os botões devem empilhar ou quebrar sem estourar o layout.

## Responsividade
- Desktop: grid de duas colunas na seção de projetos.
- Tablet e mobile: uma coluna, com leitura confortável.
- O preview nunca deve ficar vazio, cortado ou com áreas mortas grandes.
