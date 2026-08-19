#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/barabd/haat-furniture-v2/backend"
BASE="$ROOT/storage/mariadb"
PREFIX="$BASE/prefix"
DATA="$BASE/data"
SOCK="$BASE/mysql.sock"
PIDFILE="$BASE/mysql.pid"
SRC_PREFIX="/tmp/haat-mysql-prefix"
ENV_FILE="$ROOT/.env"
DB_NAME="haat_furniture"
DB_USER="haat_app"
PORT="3306"

mkdir -p "$BASE" "$DATA"

if [[ ! -x "$PREFIX/usr/sbin/mariadbd" ]]; then
  if [[ ! -x "$SRC_PREFIX/usr/sbin/mariadbd" ]]; then
    echo "Extracted MariaDB files not found at $SRC_PREFIX"
    exit 1
  fi
  mkdir -p "$PREFIX"
  cp -a "$SRC_PREFIX/." "$PREFIX/"
fi

if [[ ! -d "$DATA/mysql" ]]; then
  "$PREFIX/usr/bin/mariadb-install-db" \
    --no-defaults \
    --basedir="$PREFIX/usr" \
    --datadir="$DATA" \
    --auth-root-authentication-method=socket \
    --auth-root-socket-user="$(id -un)" \
    --skip-test-db
fi

if [[ -S "$SOCK" ]] || ss -ltn | grep -q ":${PORT} "; then
  echo "MariaDB already running."
else
  "$PREFIX/usr/sbin/mariadbd" \
    --no-defaults \
    --basedir="$PREFIX/usr" \
    --datadir="$DATA" \
    --plugin-dir="$PREFIX/usr/lib/mysql/plugin" \
    --socket="$SOCK" \
    --pid-file="$PIDFILE" \
    --port="$PORT" \
    --bind-address=127.0.0.1 \
    --skip-networking=0 \
    >/home/barabd/.pm2/logs/haat-mariadb-out.log 2>/home/barabd/.pm2/logs/haat-mariadb-error.log &
  for _ in $(seq 1 30); do
    [[ -S "$SOCK" ]] && break
    sleep 0.4
  done
fi

if [[ ! -S "$SOCK" ]]; then
  echo "MariaDB socket did not appear: $SOCK"
  exit 1
fi

if [[ -z "${HAAT_DB_PASSWORD:-}" && -f "$ENV_FILE" ]]; then
  HAAT_DB_PASSWORD="$(python3 - "$ENV_FILE" <<'PY'
from pathlib import Path
import sys
for line in Path(sys.argv[1]).read_text().splitlines():
    if line.startswith("DB_PASSWORD="):
        print(line.split("=", 1)[1])
        break
PY
)"
fi

if [[ -z "${HAAT_DB_PASSWORD:-}" ]]; then
  HAAT_DB_PASSWORD="$(python3 - <<'PY'
import secrets, string
alphabet = string.ascii_letters + string.digits
print("".join(secrets.choice(alphabet) for _ in range(24)))
PY
)"
fi

"$PREFIX/usr/bin/mariadb" --socket="$SOCK" <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${HAAT_DB_PASSWORD}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${HAAT_DB_PASSWORD}';
ALTER USER '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${HAAT_DB_PASSWORD}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${HAAT_DB_PASSWORD}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL

python3 - "$ENV_FILE" "$HAAT_DB_PASSWORD" "$SOCK" <<'PY'
from pathlib import Path
import sys
env_path = Path(sys.argv[1])
db_pass = sys.argv[2]
socket = sys.argv[3]
text = env_path.read_text()
replacements = {
    "DB_CONNECTION": "mysql",
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "3306",
    "DB_DATABASE": "haat_furniture",
    "DB_USERNAME": "haat_app",
    "DB_PASSWORD": db_pass,
    "DB_SOCKET": socket,
}
for key, value in replacements.items():
    lines = []
    found = False
    for line in text.splitlines():
        if line.startswith(key + "=") or line.startswith("# " + key + "=") or line.startswith("#" + key + "="):
            lines.append(f"{key}={value}")
            found = True
        else:
            lines.append(line)
    if not found:
        lines.append(f"{key}={value}")
    text = "\n".join(lines) + "\n"
env_path.write_text(text)
PY

echo "MariaDB user-space instance is ready."
