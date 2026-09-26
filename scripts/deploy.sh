#!/usr/bin/env bash
#
# Deploy de produção do portfólio.
#
# É executado remotamente pelo GitHub Actions via SSH (o workflow envia este
# arquivo para o servidor com `bash -s`) e também pode ser rodado manualmente
# no servidor, a partir da raiz do projeto.
#
set -euo pipefail

APP_DIR="${APP_DIR:-/home/sites/portifolio}"
SERVICE="${SERVICE:-portifolio}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

# Garante que o serviço volte ao ar mesmo se o deploy falhar no meio.
trap 'systemctl start "$SERVICE" || true' EXIT

echo "==> Parando serviço ($SERVICE)..."
systemctl stop "$SERVICE"

# O servidor é somente deploy: descarta alterações locais nos arquivos gerados
# para que o `git pull` nunca fique preso por causa de um build anterior.
echo "==> Limpando arquivos gerados..."
git checkout -- public/apresentacao 2>/dev/null || true

echo "==> Atualizando código (origin/$BRANCH)..."
git pull --ff-only origin "$BRANCH"

echo "==> Instalando dependências (npm ci)..."
npm ci --omit=dev

echo "==> Gerando páginas da apresentação..."
npm run build:apresentacao

echo "==> Iniciando serviço ($SERVICE)..."
systemctl start "$SERVICE"

echo "==> Deploy concluído."
