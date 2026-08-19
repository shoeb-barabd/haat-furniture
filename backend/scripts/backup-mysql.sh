#!/usr/bin/env bash
set -euo pipefail

ROOT="/home/barabd/haat-furniture-v2/backend"
ENV_FILE="$ROOT/.env"
DUMP_BIN="$ROOT/storage/mariadb/prefix/usr/bin/mariadb-dump"
SOCK="$ROOT/storage/mariadb/mysql.sock"
DEST_DIR="/home/barabd/backups/haat-mysql"
STAMP="$(date +%F_%H%M)"
OUT="$DEST_DIR/haat_furniture_${STAMP}.sql.gz"

mkdir -p "$DEST_DIR"

if [[ ! -x "$DUMP_BIN" ]]; then
  echo "mariadb-dump not found: $DUMP_BIN" >&2
  exit 1
fi

if [[ ! -S "$SOCK" ]]; then
  echo "MariaDB socket missing: $SOCK" >&2
  exit 1
fi

PASS="$(python3 - "$ENV_FILE" <<'PY'
from pathlib import Path
import sys
for line in Path(sys.argv[1]).read_text().splitlines():
    if line.startswith("DB_PASSWORD="):
        print(line.split("=", 1)[1])
        break
PY
)"
USER="$(python3 - "$ENV_FILE" <<'PY'
from pathlib import Path
import sys
val = "haat_app"
for line in Path(sys.argv[1]).read_text().splitlines():
    if line.startswith("DB_USERNAME="):
        val = line.split("=", 1)[1]
        break
print(val)
PY
)"
DB="$(python3 - "$ENV_FILE" <<'PY'
from pathlib import Path
import sys
val = "haat_furniture"
for line in Path(sys.argv[1]).read_text().splitlines():
    if line.startswith("DB_DATABASE="):
        val = line.split("=", 1)[1]
        break
print(val)
PY
)"

"$DUMP_BIN" --socket="$SOCK" -u "$USER" -p"$PASS" --single-transaction --routines --triggers "$DB" \
  | gzip -9 > "$OUT"

find "$DEST_DIR" -type f -name 'haat_furniture_*.sql.gz' -mtime +14 -delete
echo "Backup written: $OUT"
ls -lh "$OUT"
