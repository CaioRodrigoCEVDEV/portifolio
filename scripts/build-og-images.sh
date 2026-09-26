#!/usr/bin/env bash
# Gera as imagens Open Graph (1200x630) por segmento da apresentação.
# Requer ImageMagick 7 (`magick`). Não é necessário em runtime.
#
# Uso: bash scripts/build-og-images.sh
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/public/assets/img/og"
BOLD="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
REG="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
MONO="/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

mkdir -p "$OUT"

# slug|título|subtítulo
SEGMENTS=(
  "geral|Presença digital|Sites e catálogos para empresas"
  "celulares|Celulares|Sites, catálogos e assistência"
  "autopecas|Autopeças|Catálogo de peças e orçamentos"
  "assistencias|Assistências|Serviços, orçamentos e contato"
)

for item in "${SEGMENTS[@]}"; do
  IFS="|" read -r slug title subtitle <<< "$item"
  magick -size 1200x630 radial-gradient:'#123a24'-'#07110B' \
    -fill '#22C55E' -draw "rectangle 80,150 220,157" \
    -font "$MONO" -pointsize 24 -fill '#22C55E' -annotate +80+80 'APRESENTAÇÃO' \
    -font "$BOLD" -pointsize 92 -fill '#F0FDF4' -annotate +80+280 "$title" \
    -font "$REG" -pointsize 36 -fill '#BBF7D0' -annotate +80+350 "$subtitle" \
    -font "$MONO" -pointsize 26 -fill '#94B5A1' -annotate +80+560 'caiorodrigocev.com.br/apresentacao' \
    -strip -depth 8 -define png:compression-level=9 \
    "$OUT/$slug.png"
  echo "gerado: public/assets/img/og/$slug.png"
done
