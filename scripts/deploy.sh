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

echo "==> Atualizando código (origin/$BRANCH)..."
git pull --ff-only origin "$BRANCH"

echo "==> Instalando dependências (npm ci)..."
npm ci --omit=dev

echo "==> Iniciando serviço ($SERVICE)..."
systemctl start "$SERVICE"

echo "==> Deploy concluído."
