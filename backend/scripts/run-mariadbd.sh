#!/usr/bin/env bash
set -euo pipefail
BASE="/home/barabd/haat-furniture-v2/backend/storage/mariadb"
PREFIX="$BASE/prefix"
SOCK="$BASE/mysql.sock"
PIDFILE="$BASE/mysql.pid"
BIN="$PREFIX/usr/sbin/mariadbd"

is_alive() {
  local pid="$1"
  [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null
}

if [[ -f "$PIDFILE" ]]; then
  OLD_PID="$(tr -d '[:space:]' < "$PIDFILE" || true)"
  if is_alive "$OLD_PID"; then
    # Adopt the running daemon so PM2 restarts it if it dies.
    while is_alive "$OLD_PID"; do
      sleep 5
    done
  fi
  rm -f "$PIDFILE"
fi

if [[ -S "$SOCK" ]]; then
  rm -f "$SOCK"
fi

exec "$BIN" \
  --no-defaults \
  --basedir="$PREFIX/usr" \
  --datadir="$BASE/data" \
  --plugin-dir="$PREFIX/usr/lib/mysql/plugin" \
  --socket="$SOCK" \
  --pid-file="$PIDFILE" \
  --port=3306 \
  --bind-address=127.0.0.1
