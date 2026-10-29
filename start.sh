#!/usr/bin/env bash
# Start the Engineering Intelligence Factory: database, API, and frontend.
#
# Usage:
#   ./start.sh                 # start everything (Ctrl+C stops the API and frontend)
#   API_PORT=8001 ./start.sh   # override a port
#   SKIP_DB=1 ./start.sh       # don't try to start Postgres (already running elsewhere)
#
# Ports: API http://localhost:$API_PORT (docs at /docs), frontend http://localhost:$FRONTEND_PORT
# (demo at /demo).

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_PORT="${API_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3001}"
DB_PORT="${DB_PORT:-5432}"
VENV="$ROOT/.venv"

log() { printf '\033[1;36m[start]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn]\033[0m %s\n' "$*"; }
die() { printf '\033[1;31m[error]\033[0m %s\n' "$*" >&2; exit 1; }

port_in_use() {
  (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
}

# ---- Prerequisites ---------------------------------------------------------
command -v python3 >/dev/null || die "python3 not found on PATH"
command -v node >/dev/null || die "node not found on PATH (Node 20.9+ is required by Next.js 16)"
command -v npm >/dev/null || die "npm not found on PATH"

# ---- Python environment ----------------------------------------------------
if [ ! -x "$VENV/bin/python" ]; then
  log "Creating virtualenv at .venv"
  python3 -m venv "$VENV"
fi
if ! "$VENV/bin/python" -c "import fastapi, sqlalchemy, uvicorn" 2>/dev/null; then
  log "Installing backend dependencies"
  "$VENV/bin/pip" install --quiet --upgrade pip
  "$VENV/bin/pip" install --quiet -e "$ROOT" || die "pip install failed (see output above)"
fi

# ---- Database --------------------------------------------------------------
if [ "${SKIP_DB:-0}" = "1" ]; then
  log "SKIP_DB=1: not starting Postgres"
elif port_in_use "$DB_PORT"; then
  log "Postgres already listening on :$DB_PORT"
elif command -v docker-compose >/dev/null || command -v docker >/dev/null; then
  log "Starting Postgres and Redis via docker-compose"
  (cd "$ROOT" && (docker-compose up -d postgres redis 2>/dev/null || docker compose up -d postgres redis)) \
    || warn "docker-compose failed; the API will start but database calls will fail"
  log "Applying migrations"
  (cd "$ROOT" && "$VENV/bin/alembic" upgrade head) || warn "migrations failed"
else
  warn "Postgres is not running on :$DB_PORT and Docker is not available."
  warn "The API will start, but database-backed routes will fail until Postgres is up."
fi

# ---- Frontend dependencies -------------------------------------------------
if [ ! -d "$ROOT/frontend/node_modules" ]; then
  log "Installing frontend dependencies"
  (cd "$ROOT/frontend" && npm install) || die "npm install failed"
fi

# ---- Port checks -----------------------------------------------------------
port_in_use "$API_PORT" && die "port $API_PORT is already in use (set API_PORT to change it)"
port_in_use "$FRONTEND_PORT" && die "port $FRONTEND_PORT is already in use (set FRONTEND_PORT to change it)"

# ---- Launch ----------------------------------------------------------------
PIDS=()

# Kill a process and all of its descendants (npx -> next -> next-server).
kill_tree() {
  local pid=$1 child
  for child in $(pgrep -P "$pid" 2>/dev/null); do kill_tree "$child"; done
  kill "$pid" 2>/dev/null || true
}

cleanup() {
  trap - EXIT INT TERM
  log "Stopping services"
  for pid in "${PIDS[@]:-}"; do kill_tree "$pid"; done
  wait 2>/dev/null || true
}
trap cleanup EXIT INT TERM

log "Starting API on http://localhost:$API_PORT"
(cd "$ROOT" && exec "$VENV/bin/python" -m uvicorn src.api.main:app \
  --host 0.0.0.0 --port "$API_PORT" --reload) &
PIDS+=("$!")

log "Starting frontend on http://localhost:$FRONTEND_PORT"
(cd "$ROOT/frontend" && exec env NEXT_PUBLIC_API_URL="http://localhost:$API_PORT" \
  npx next dev -p "$FRONTEND_PORT") &
PIDS+=("$!")

log "Ready. Demo: http://localhost:$FRONTEND_PORT/demo   API docs: http://localhost:$API_PORT/docs"
log "Press Ctrl+C to stop."
wait
