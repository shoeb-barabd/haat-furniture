# HAAT Furniture — Client handover

Live: https://haat.barabdonline.com  
Admin: https://haat.barabdonline.com/admin  
Server: `barabd@10.111.47.20` (`/home/barabd/haat-furniture-v2`)

## After deploy

1. Hard refresh admin (**Ctrl+Shift+R**) and log in again (old passwords no longer work).
2. Admin usernames: `sudoadmin` / `adminmanager` / `viewonly`.
3. Passwords were rotated at handover — see the developer chat message (also `backend/.env` `HAAT_ADMIN_*_PASS`). Do not commit `.env`.
4. Image upload works. Photos larger than ~1MB may get Nginx 413 until `client_max_body_size 10m;` is set (needs sudo).

## What was finished for handover

- MySQL/MariaDB catalog + orders
- Admin login on the server (not in page JavaScript)
- Product / order / banner APIs require admin token for private data
- Checkout totals calculated from database prices
- Image upload to `/uploads/` via Laravel
- Categories save to MySQL
- Bulk discount (sudo only) writes new prices to MySQL
- Order status dropdown saves to MySQL
- Nightly DB backup at 02:15 → `/home/barabd/backups/haat-mysql/`
- Laravel listens on `127.0.0.1:8000` only
- `APP_DEBUG=false`

## Day-to-day

```bash
pm2 list
cd /home/barabd/haat-furniture-v2/frontend && npm run build && pm2 restart haat-frontend
pm2 restart haat-backend
```

Database:

```bash
cd /home/barabd/haat-furniture-v2/backend
PASS=$(grep '^DB_PASSWORD=' .env | cut -d= -f2-)
./storage/mariadb/prefix/usr/bin/mariadb -h 127.0.0.1 -P 3306 -u haat_app -p"$PASS" haat_furniture
```

Full technical notes: `DOCUMENTATION.md`  
Open issues (P2/P3): `ISSUES.md`
