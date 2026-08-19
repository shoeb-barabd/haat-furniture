#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/barabd/haat-furniture-v2/backend"
ENV_FILE="$ROOT/.env"
DB_NAME="haat_furniture"
DB_USER="haat_app"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "Missing $ENV_FILE"
  exit 1
fi

if [[ -z "${HAAT_DB_PASSWORD:-}" ]]; then
  HAAT_DB_PASSWORD="$(python3 - <<'PY'
import secrets, string
alphabet = string.ascii_letters + string.digits
print("".join(secrets.choice(alphabet) for _ in range(24)))
PY
)"
fi
DB_PASS="$HAAT_DB_PASSWORD"

if [[ "${EUID}" -ne 0 ]]; then
  echo "MariaDB install needs root. Run:"
  echo "  sudo HAAT_DB_PASSWORD='<password>' bash $0"
  echo "Or let the script generate one:"
  echo "  sudo bash $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y mariadb-server php8.3-mysql

if command -v systemctl >/dev/null 2>&1; then
  systemctl enable --now mariadb || systemctl enable --now mysql || true
fi

mysql --protocol=socket <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
CREATE USER IF NOT EXISTS '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'127.0.0.1' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'127.0.0.1';
FLUSH PRIVILEGES;
SQL

APP_USER="${SUDO_USER:-barabd}"
python3 - "$ENV_FILE" "$DB_PASS" <<'PY'
from pathlib import Path
import sys
env_path = Path(sys.argv[1])
db_pass = sys.argv[2]
text = env_path.read_text()
replacements = {
    "DB_CONNECTION": "mysql",
    "DB_HOST": "127.0.0.1",
    "DB_PORT": "3306",
    "DB_DATABASE": "haat_furniture",
    "DB_USERNAME": "haat_app",
    "DB_PASSWORD": db_pass,
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

cd "$ROOT"
sudo -u "$APP_USER" php artisan config:clear
sudo -u "$APP_USER" php artisan migrate --force --seed

echo "MySQL is ready: database ${DB_NAME}, user ${DB_USER}."
echo "Credentials were written to backend/.env"
