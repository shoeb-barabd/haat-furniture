# HAAT Furniture — Full Issue Audit

Date: 19 August 2026  
Live: https://haat.barabdonline.com  
Server: Ubuntu 24.04, `barabd@Frontend-server` (`10.111.47.20`)

Shop **works** (homepage, catalog, checkout, MySQL orders).

**P1 status (19 Aug 2026):** upload, category DB, bulk discount, order status — **done**. Remaining start at P2.

---

Severity: **P0** = security / data loss · **P1** = broken feature · **P2** = ops / quality · **P3** = polish

---

## P0 — Security & data loss — FIXED 19 Aug 2026

| ID | Was | Now |
|---|---|---|
| P0-1 | Admin passwords in frontend JS | Login is `POST /api/v1/admin/login`. Passwords only in `backend/.env` (quoted). |
| P0-2 | Product write API public | `POST/PUT/DELETE /api/v1/products` need Bearer token. View role is 403. |
| P0-3 | Orders list public | `GET /api/v1/orders` needs admin token. Checkout `POST /api/v1/orders` still public. |
| P0-4 | Banner PUT public | `PUT /api/v1/banners` needs write token. |
| P0-5 | Checkout trusted client totals | Server recomputes price from MySQL `line_items` + coupon + district shipping. |
| P0-6 | `APP_DEBUG=true` | `APP_DEBUG=false`, `APP_ENV=production`. |
| P0-7 | Laravel `0.0.0.0:8000` | `artisan serve --host=127.0.0.1 --port=8000`. LAN :8000 closed. |
| P0-8 | No DB backup | Cron `15 2 * * *` → `/home/barabd/backups/haat-mysql/` (14-day retention). |
| P0-9 | MariaDB wait-loop vs orphan | `run-mariadbd.sh` starts `mariadbd` if dead; after reboot PM2 can start it. |

---

| ID | Issue | Detail |
|---|---|---|
| P0-1 | Admin passwords in frontend JS | `frontend/src/app/admin/page.js` has `sudoadmin` / `adminmanager` / `viewonly` passwords in source. Anyone can view page JS and log in. |
| P0-2 | Product API has no auth | Public `POST/PUT/DELETE /api/v1/products` — anyone can add, edit, or delete catalog. Admin UI “roles” are only in the browser. |
| P0-3 | Orders API has no auth | `GET /api/v1/orders` returns customer name, phone, email, address to the whole internet. `POST` can fake orders with any total/status. |
| P0-4 | Banner API has no auth | `PUT /api/v1/banners` can change homepage without login. |
| P0-5 | Checkout trusts client prices | Browser sends `total`, `discount`, coupon `HAAT10`. Attacker can POST `total: 1`. |
| P0-6 | `APP_DEBUG=true` + `APP_ENV=local` | Laravel error pages dump SQL, paths, stack traces. `.env` also has `APP_URL=http://localhost`. |
| P0-7 | Laravel bound on `0.0.0.0:8000` | `php artisan serve --host=0.0.0.0`. LAN IP `10.111.47.20:8000` answers APIs **bypassing Nginx**. Built-in PHP server is not for production. |
| P0-8 | No database backup | No crontab, no dump job. If disk/VM dies, catalog + live orders are gone. MariaDB data lives only under `backend/storage/mariadb/data`. |
| P0-9 | MariaDB is not a real systemd service | User-space extract. PM2 `haat-mariadb` is a **sleep loop** waiting on the socket; the real `mariadbd` is PID 90441 (orphan, PPID 1). After reboot PM2 may **not** start MariaDB if the socket is gone and the wait-script logic races, or it may start a second instance. |

---

## P1 — Broken or fake features — FIXED 19 Aug 2026

| ID | Was | Now |
|---|---|---|
| P1-1 | Image upload 404 | Laravel `POST /api/v1/upload` → `frontend/storage/uploads`; Next serves `/uploads/{file}` |
| P1-2 | Category admin not saved | `POST/PUT/DELETE /api/v1/categories` |
| P1-3 | Bulk discount screen-only | `POST /api/v1/products/bulk-discount` (sudo) writes MySQL prices |
| P1-4 | Order status not in DB | `PUT /api/v1/orders` `{id, status}` |
| P1-5 | Inquiries dummy | Still sample names (not a live form) |
| P1-6 | `/products` no cart | Still only homepage + product page add-to-cart |

---

| ID | Issue | Detail |
|---|---|---|
| P1-1 | Image upload 404 | `POST /api/v1/upload` is a Next.js route. Nginx sends **all** `/api/` to Laravel. Live returns **404**. Admin PC upload does not work. |
| P1-2 | Category admin does not save | Add/edit/delete category only updates React state. Refresh = gone. No Laravel category write API. |
| P1-3 | Bulk discount does not save | Recalculates prices in the browser only. Storefront/MySQL unchanged. |
| P1-4 | Order status cannot be changed in DB | Admin shows status; no PUT `/orders`. Cannot mark Delivered/Cancelled in MariaDB. |
| P1-5 | Inquiries are dummy data | Hardcoded “Dr. Rakib Hasan” / “Engr. Farhana Islam” — not real leads, not in DB. |
| P1-6 | `/products` and category pages have no cart | Catalog Cart link goes to `/checkout`. No add-to-cart, no drawer. Only homepage + product page add to cart. |
| P1-7 | Next.js product/order/banner routes are dead | `frontend/src/app/api/v1/{products,orders,banners}` never served publicly. Confusing dual source of truth. |
| P1-8 | SQLite leftover vs MySQL | `database/database.sqlite` still exists (old seed). Live uses MariaDB. Easy to migrate the wrong DB by mistake. |

---

## P2 — Server / deploy / database ops — mostly FIXED 19 Aug 2026

| ID | Was | Now |
|---|---|---|
| P2-14 | Nginx upload ~1MB | `client_max_body_size 10m;` set |
| P2-1/2 | Duplicate Nginx vhosts | `frontend` symlink removed; only `haat-furniture` active |
| P2-3 | artisan serve (single-thread) | PHP-FPM pool `haat` via unix socket; `artisan serve` stopped |
| P2-4 | pdo_mysql not installed | `php8.3-mysql` installed via apt |
| P2-6 | No git | `git init` + initial commit |
| P2-8 | PM2 startup missing | `pm2 startup` configured; nginx/fpm enabled on boot |

### Remaining P2
| P2-5 | Queue/cache/session = `database` | `QUEUE_CONNECTION=database` but **no queue worker**. Jobs table unused. Session/cache on MySQL for an API that barely uses sessions. |
| P2-6 | No git repository on server | `haat-furniture-v2` is not a git repo. No version history, no rollback. |
| P2-7 | `pm2` frontend restarted 67 times | History of instability (likely rebuilds). Fine now, but no deploy script — manual `npm run build && pm2 restart`. |
| P2-8 | System reboot required | Kernel `linux-image-7.0.0-29-generic` pending. Reboot without verifying MariaDB autostart = site down. |
| P2-9 | RAM tight | 3.8 GiB total, ~2.1 GiB used. Next + Laravel + MariaDB + cloudflared on one VM. |
| P2-10 | Disk 53% | 32G disk, 16G used. MariaDB prefix (~178MB+) + `node_modules` + `.next`. No log rotation documented. |
| P2-11 | HTTPS only via Cloudflare Tunnel | Nginx is HTTP :80 only. If tunnel dies, no local HTTPS. Laravel `APP_URL` still localhost. |
| P2-12 | `setup-mysql.sh` vs live setup mismatch | Script installs apt MariaDB; live is user-space. Running the script later can create a **second** MySQL on 3306 and break the site. |
| P2-13 | Mail not configured | `MAIL_MAILER=log`. No order confirmation email to customer or shop. |
| P2-14 | No monitoring / health alerts | No uptime check beyond Cloudflare. If `mariadbd` dies, APIs 500 with debug HTML. |

---

## P3 — Product / UX / content

| ID | Issue | Detail |
|---|---|---|
| P3-1 | ~~Two WhatsApp numbers~~ | **FIXED** — unified to 09617333990 |
| P3-2 | ~~Images hosted on old domain~~ | **FIXED** — 284 images downloaded to `frontend/storage/uploads/`; DB + homepage updated to `/uploads/` |
| P3-3 | ~~Privacy policy says haatfurniture.com~~ | **FIXED** — URL changed to haat.barabdonline.com |
| P3-4 | “Dinning” typo (WordPress slug) | `dinning-room` / `dinning-set` used everywhere. Changing slug would break URLs. |
| P3-5 | Cart only in `localStorage` | No login, no server cart. Phone change / clear cache = empty cart. |
| P3-6 | Coupon only on frontend | `HAAT10` not stored in DB. Easy to abuse (see P0-5). |
| P3-7 | Order items are a text string | `"Wheel Bed (x1)"` — no product id, no line items table. Reporting/stock later will be hard. |
| P3-8 | Duplicate JSON catalogs | `products_128_data.json`, `imported_wp_products.json`, `site-orders.json`, `site-banners.json` can drift from MySQL. |
| P3-9 | Admin session in localStorage | Easy to forge `haat_admin_session`. Combined with P0-1. |
| P3-10 | Audit log is localStorage | Not a real server audit. |
| P3-11 | No stock / inventory | Products have no qty. Oversell possible. |
| P3-12 | No customer accounts | Cannot see order history. |
| P3-13 | bKash/Nagad not verified | TrxID is a text field. No API check. |
| P3-14 | Global `Cache-Control: no-store` | Next config disables caching on all pages — slower, more origin load. |
| P3-15 | Homepage still has hardcoded fallback products | If API fails, old JSON/hardcoded cards show — prices may not match DB. |
| P3-16 | Order ID collision risk | Fallback id `HF-` + last 6 digits of `time()`. Two orders in the same second can clash. Checkout uses random `HF-######` which is better. |
| P3-17 | No automated tests | phpunit configured, shop APIs untested. |
| P3-18 | Admin visible on homepage | Small Admin link is public. |

---

## What is actually OK

- Live site 200; products/orders/banners APIs 200
- PM2: `haat-frontend`, `haat-backend`, `haat-mariadb` reported online; `pm2-barabd` enabled
- Cloudflare Tunnel active
- MariaDB `haat_furniture` has products (~128), categories, orders, banners
- Checkout POST writes to MySQL
- Cart drawer z-index fix on homepage
- 5-year warranty copy on main pages
- `pm2 save` dump exists

---

## Fix order for handover (recommended)

1. **P0:** Hide admin passwords; add API token/auth for write + GET orders; `APP_DEBUG=false`; bind Laravel to `127.0.0.1` only.
2. **P0:** Nightly `mysqldump` cron; confirm MariaDB starts on reboot (one PM2 process = real `mariadbd`).
3. **P1:** Laravel upload route; persist categories, bulk discount, order status.
4. **P2:** Disable extra Nginx site; stop using `artisan serve` (php-fpm + nginx).
5. **P3:** One WhatsApp number; copy images off haatfurniture.com; privacy URL.

---

Related: [DOCUMENTATION.md](./DOCUMENTATION.md)
