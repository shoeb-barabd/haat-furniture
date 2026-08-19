# HAAT Furniture — Project Profile & Technology Document

> **Version:** 2.0 &nbsp;|&nbsp; **Last Updated:** August 19, 2026  
> **Domain:** [haat.barabdonline.com](https://haat.barabdonline.com)  
> **Client:** HAAT Furniture, Dhaka, Bangladesh

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Frontend — Features & Engineering](#4-frontend--features--engineering)
5. [Backend — API & Business Logic](#5-backend--api--business-logic)
6. [Database Design](#6-database-design)
7. [Admin Panel](#7-admin-panel)
8. [DevOps & Infrastructure](#8-devops--infrastructure)
9. [Performance Optimizations](#9-performance-optimizations)
10. [Security Measures](#10-security-measures)
11. [Automation & Scripts](#11-automation--scripts)
12. [Advanced / Noteworthy Implementations](#12-advanced--noteworthy-implementations)
13. [API Reference](#13-api-reference)
14. [Project Statistics](#14-project-statistics)

---

## 1. Executive Summary

HAAT Furniture v2 is a **full-stack e-commerce platform** built from the ground up for a Dhaka-based furniture retailer. The platform replaces a legacy WordPress/WooCommerce site with a modern, high-performance stack — **Next.js 16 + React 19** on the frontend and **Laravel 12 + PHP 8.3** on the backend, powered by **MariaDB 10.11**.

The system supports a public storefront with 128+ products, a role-based admin dashboard, real-time order management, automated backups, and is deployed behind **Cloudflare Tunnel** for zero-downtime HTTPS access.

---

## 2. Technology Stack

### Core Frameworks & Languages

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend Framework | **Next.js** (App Router) | 16.3.1 |
| UI Library | **React** | 19.2.8 |
| CSS Framework | **Tailwind CSS** | 4.0 |
| Backend Framework | **Laravel** | 12.0 |
| Backend Language | **PHP** | 8.3 |
| Database | **MariaDB** | 10.11 |
| API Auth | **Laravel Sanctum** | 4.0 |

### Infrastructure & DevOps

| Component | Technology |
|-----------|-----------|
| Operating System | Ubuntu 24.04 LTS (Kernel 7.0) |
| Web Server / Reverse Proxy | Nginx |
| PHP Processing | PHP-FPM 8.3 (Unix Socket) |
| Process Manager | PM2 |
| HTTPS / CDN | Cloudflare Tunnel |
| Version Control | Git |
| Backup | Automated nightly MariaDB dumps (gzip, 14-day retention) |

### Development & Tooling

| Tool | Purpose |
|------|---------|
| ESLint + eslint-config-next | Code quality & linting |
| PostCSS + @tailwindcss/postcss | CSS build pipeline |
| PHPUnit 11.5 | Backend unit/integration testing |
| Laravel Pint | PHP code style enforcement |
| Laravel Tinker | Interactive REPL for database operations |
| Python 3 | Data migration scripts |

---

## 3. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    VISITOR / ADMIN BROWSER                   │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTPS
                           ▼
┌─────────────────────────────────────────────────────────────┐
│              CLOUDFLARE TUNNEL (haat.barabdonline.com)       │
│              ─ DDoS Protection, SSL Termination, Caching ─  │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                     NGINX (Reverse Proxy)                    │
│                     Port 80, Ubuntu VM                       │
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │  /  →  Next.js:3000 │    │  /api/  →  PHP-FPM Socket   │ │
│  │  (PM2: haat-frontend)│    │  (pool: haat, unix socket)  │ │
│  └─────────────────────┘    └──────────────┬──────────────┘ │
└─────────────────────────────────────────────┼───────────────┘
                                              │
                                              ▼
                              ┌───────────────────────────┐
                              │    MariaDB 10.11 (:3306)  │
                              │    Database: haat_furniture│
                              │    PM2: haat-mariadb       │
                              └───────────────────────────┘
```

**Key architectural decisions:**

- **Decoupled frontend/backend** — Next.js handles rendering and static assets; Laravel handles all business logic via REST API
- **PHP-FPM** replaces `artisan serve` for production-grade PHP processing via Unix socket (lower latency, higher throughput)
- **Cloudflare Tunnel** provides HTTPS without needing a public IP or SSL certificate management
- **PM2** manages all three long-running processes (frontend, backend DB, MariaDB) with auto-restart and startup hooks

---

## 4. Frontend — Features & Engineering

### 4.1 Storefront Pages

| Page | Route | Highlights |
|------|-------|-----------|
| Homepage | `/` | Hero slider (6 slides), category showcase, product grids, cart drawer |
| Product Catalog | `/products` | Full catalog with search & category filtering |
| Product Detail | `/product/[id]` | Image gallery with zoom, add-to-cart, WhatsApp inquiry |
| Category Pages | `/product-category/[...slug]` | Nested category tree with dynamic filters |
| Checkout | `/checkout` | Multi-step: address → shipping (Dhaka ৳60 / outside ৳150) → payment → order |
| About Us | `/about-us` | Company story and values |
| Terms & Conditions | `/terms-conditions` | 5-year warranty policy |
| Privacy Policy | `/privacy-policy` | GDPR-style data handling policy |
| Refund & Returns | `/refund-returns-policy` | Return/exchange policy |

### 4.2 UI/UX Features

- **Hero Banner Slider** — 6-slide carousel with:
  - Ken Burns zoom-in animation (CSS keyframes)
  - Smooth crossfade transitions (5–6 second overlap, no black flash)
  - Synchronized caption fade timing
  - Glassmorphism hero offer card (auto-hide, hover-reveal)
  - Admin-configurable titles, subtitles, and badges per slide
- **Cart System** — Persistent localStorage cart with animated slide-out drawer, quantity controls, and real-time total calculation
- **Responsive Design** — Full mobile/tablet/desktop breakpoints via Tailwind CSS
- **Custom Cursor** — Branded wood-chip cursor image
- **WhatsApp Integration** — Direct order/inquiry via WhatsApp with pre-filled product details
- **Coupon System** — `HAAT10` = 10% discount, validated at checkout
- **Multiple Payment Methods** — COD, bKash, Nagad, WhatsApp order

### 4.3 Image Handling

- **Dynamic Image Serving** — Next.js API route (`/uploads/[filename]`) serves uploaded images from private storage with proper MIME types and cache headers
- **Image Upload Pipeline** — Admin uploads → Laravel API → saved to `frontend/storage/uploads/` → served via Next.js
- **Cache Headers** — `max-age=86400, must-revalidate` for uploads; `immutable` for build assets
- **Remote Image Localization** — Python script migrated 284 product images from old WordPress domain to local storage

---

## 5. Backend — API & Business Logic

### 5.1 Laravel Application

- **RESTful API** — 17 endpoints under `/api/v1/` covering products, categories, orders, banners, uploads, and admin auth
- **Custom Middleware** (`EnsureHaatAdmin`) — Token-based authentication with role enforcement (sudo/admin/view)
- **Encrypted Tokens** — `Crypt::encryptString()` payloads containing username, role, and 12-hour expiry (no plaintext passwords in transit)
- **Server-Side Price Calculation** — Order totals computed on backend to prevent client-side tampering
- **Rate Limiting** — Login endpoint throttled at 8 requests/minute
- **CORS & Security Headers** — Configured via Laravel Sanctum

### 5.2 Key Business Logic

- **Bulk Discount Engine** — Apply percentage discount to entire categories; stores `old_price` for reference, sudo-only
- **Order ID Generation** — Sequential `HF-######` format
- **Gallery Support** — Products support JSON array of multiple images
- **Category Tree** — Hierarchical categories with slug-based routing and item counts
- **Banner Configuration** — Site-wide banner/slide management via `site_settings` key-value store

---

## 6. Database Design

**Engine:** MariaDB 10.11 &nbsp;|&nbsp; **Database:** `haat_furniture`

| Table | Records | Purpose |
|-------|---------|---------|
| `products` | 128+ | Catalog: name, price, old_price, image, gallery (JSON), category, description |
| `categories` | ~15 | Category tree with slugs and product counts |
| `orders` | Dynamic | Customer orders: items, totals, address, phone, status, payment method |
| `site_settings` | ~3 | Key-value JSON store (hero banners, site config) |
| `sessions` | Dynamic | Laravel session storage |
| `cache` | Dynamic | Laravel cache storage |
| `personal_access_tokens` | — | Sanctum token management |
| `migrations` | 8 | Schema version tracking |

---

## 7. Admin Panel

### 7.1 Role-Based Access Control

| Role | Username | Permissions |
|------|----------|------------|
| **Sudo Admin** | `sudoadmin` | Full access + bulk discount + user management |
| **Admin Manager** | `adminmanager` | Product/Order/Category/Banner CRUD |
| **View Only** | `viewonly` | Read-only access to all data |

### 7.2 Admin Features

- **Dashboard** — Analytics overview with key metrics
- **Products Tab** — Create, edit, delete products with image upload; search and filter
- **Orders Tab** — Real-time order feed (auto-polling every 8 seconds); status updates (Pending → Processing → Shipped → Delivered → Cancelled)
- **Categories Tab** — Full CRUD with item count display
- **Banners Tab** — Hero slide management (6 slots) with title/subtitle/badge fields; hero offer card configuration; image upload and remove
- **Bulk Discount** — Apply percentage discount to all products in a category (sudo only)
- **Secure Authentication** — Encrypted bearer tokens with 12-hour expiry; credentials stored server-side in `.env`

---

## 8. DevOps & Infrastructure

### 8.1 Process Management (PM2)

| Process | Description |
|---------|------------|
| `haat-frontend` | Next.js production server on port 3000 |
| `haat-backend` | Laravel backend (PHP-FPM via Nginx) |
| `haat-mariadb` | User-space MariaDB daemon |

All processes configured with **PM2 startup hooks** — auto-restart on crash and server reboot.

### 8.2 Nginx Configuration

- Reverse proxy: `/` → Next.js, `/api/` → PHP-FPM
- `client_max_body_size 10m` for image uploads
- FastCGI parameters properly configured for Laravel
- Gzip compression enabled

### 8.3 PHP-FPM Pool

- Dedicated pool `[haat]` with Unix socket at `/run/php/haat-fpm.sock`
- Custom `PHP_INI_SCAN_DIR` for loading `pdo_mysql` extension
- Upload limits: `upload_max_filesize=8M`, `post_max_size=10M`

### 8.4 Automated Backups

- **Schedule:** Nightly at 02:15 AM via cron
- **Method:** `mariadb-dump` → gzip compression
- **Retention:** 14-day rolling window
- **Location:** `/home/barabd/backups/haat-mysql/`

### 8.5 Cloudflare Tunnel

- Zero-config HTTPS for `haat.barabdonline.com`
- DDoS protection and edge caching included
- No public IP or SSL certificate management required

---

## 9. Performance Optimizations

| Optimization | Details |
|-------------|---------|
| **PHP-FPM** | Replaced `artisan serve` with FPM for 3–5x better PHP throughput |
| **Static Asset Caching** | `Cache-Control: immutable` for `_next/static/`, 7-day for images |
| **Image Compression** | Hero images optimized to ~230KB; product images served at appropriate sizes |
| **Lazy Loading** | Only active + next hero slides are preloaded; others use `loading="lazy"` |
| **Preload Hints** | First hero image preloaded via `<link rel="preload">` in document head |
| **Cloudflare Edge Cache** | Static assets cached at Cloudflare's edge PoPs globally |
| **LocalStorage Cart** | Cart operations are instant (no server round-trip until checkout) |
| **Database Connection Pooling** | PHP-FPM maintains persistent DB connections |
| **Nginx Gzip** | All text-based responses compressed at the proxy level |

---

## 10. Security Measures

| Measure | Implementation |
|---------|---------------|
| **HTTPS Everywhere** | Cloudflare Tunnel terminates SSL; all traffic encrypted |
| **Encrypted Admin Tokens** | Laravel `Crypt::encryptString()` with 12-hour TTL |
| **No Plaintext Passwords** | Admin credentials stored in `.env` (not in code or database) |
| **Rate Limiting** | Login endpoint: 8 requests/minute |
| **CORS** | Configured via Laravel Sanctum |
| **Server-Side Pricing** | Order totals calculated on backend (prevents client manipulation) |
| **Input Validation** | Laravel request validation on all write endpoints |
| **File Upload Security** | Whitelist MIME types (jpg, png, webp, gif, svg only) |
| **Private Upload Storage** | Uploaded files stored outside `public/` in `storage/uploads/` |
| **Bcrypt** | 12 rounds for any password hashing |
| **Database Isolation** | MariaDB binds to `127.0.0.1` only; no external access |
| **Git Exclusions** | `.env`, `storage/uploads/`, `node_modules/` excluded from version control |

---

## 11. Automation & Scripts

| Script | Language | Purpose |
|--------|----------|---------|
| `backend/scripts/run-mariadbd.sh` | Bash | PM2-managed MariaDB daemon launcher |
| `backend/scripts/start-user-mariadb.sh` | Bash | Full user-space MariaDB bootstrap (install, init, create DB/user) |
| `backend/scripts/setup-mysql.sh` | Bash | System-level MariaDB + PHP MySQL extension installation |
| `backend/scripts/backup-mysql.sh` | Bash | Nightly mysqldump → gzip with 14-day retention |
| `backend/bin/php-with-mysql` | Bash | PHP wrapper loading pdo_mysql from custom extension directory |
| `scripts/localize-images.py` | Python 3 | Migrate 284 remote product images to local storage; update DB URLs |
| PM2 startup hooks | System | Auto-start all services on server reboot |
| Cron (02:15 daily) | System | Trigger nightly database backup |

---

## 12. Advanced / Noteworthy Implementations

### 12.1 User-Space MariaDB
MariaDB runs entirely in user-space (`/home/barabd/haat-furniture-v2/backend/storage/mariadb/`) without requiring root privileges. Custom socket, data directory, and binary paths are all contained within the project. This enables full database operations on shared hosting or restricted environments.

### 12.2 Custom PHP Extension Loading
A `bin/php-with-mysql` wrapper script dynamically sets `PHP_INI_SCAN_DIR` to load the `pdo_mysql` extension from a project-local directory, bypassing system PHP configuration limitations.

### 12.3 Hero Slider Animation System
The hero section uses a multi-layer CSS animation system:
- **Ken Burns Effect** — CSS `@keyframes` zoom-in animation on each slide
- **Crossfade Transitions** — Overlapping opacity transitions (5–6s) between previous and active slides, eliminating any black/blank frames
- **Caption Synchronization** — Caption fade-in is delayed to align with image crossfade completion
- **Glassmorphism Offer Card** — Semi-transparent frosted-glass overlay with auto-hide behavior and hover reveal

### 12.4 WordPress-to-Next.js Migration
The entire product catalog (128 products, 284 images) was migrated from a WordPress/WooCommerce installation:
- Product data imported via JSON seed files → Laravel seeder → MariaDB
- All remote images downloaded and localized via automated Python script
- Database URLs updated in bulk via Laravel Tinker

### 12.5 Encrypted Stateless Admin Auth
Admin authentication uses Laravel's `Crypt::encryptString()` to create self-contained encrypted tokens (not stored in database). Each token carries the username, role, and expiry timestamp. The backend decrypts and validates on every request — no session storage or database lookup required.

### 12.6 Dual-Mode Image Serving
Uploaded images are stored in a private directory (`frontend/storage/uploads/`) and served through a Next.js dynamic API route that validates filenames, maps extensions to MIME types, and sets appropriate cache headers. This prevents directory traversal attacks while maintaining CDN-friendly caching.

---

## 13. API Reference

**Base URL:** `https://haat.barabdonline.com/api/v1`

### Public Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/products` | List products (query: `category`, `search`) |
| `GET` | `/products/{id}` | Get single product |
| `GET` | `/categories` | List categories with item counts |
| `GET` | `/banners` | Get homepage banner configuration |
| `POST` | `/orders` | Place new order |
| `POST` | `/admin/login` | Admin login (returns encrypted token) |

### Authenticated Endpoints (Bearer Token)

| Method | Endpoint | Min. Role | Description |
|--------|----------|-----------|-------------|
| `GET` | `/admin/me` | view | Current admin info |
| `GET` | `/orders` | view | List latest 500 orders |
| `POST` | `/products` | admin | Create product |
| `PUT` | `/products` | admin | Update product |
| `DELETE` | `/products` | admin | Delete product |
| `POST` | `/products/bulk-discount` | sudo | Bulk category discount |
| `POST` | `/categories` | admin | Create category |
| `PUT` | `/categories` | admin | Update category |
| `DELETE` | `/categories` | admin | Delete category |
| `PUT` | `/orders` | admin | Update order status |
| `PUT` | `/banners` | admin | Update banner config |
| `POST` | `/upload` | admin | Upload image file |

---

## 14. Project Statistics

| Metric | Value |
|--------|-------|
| **Total Products** | 128+ |
| **Product Images (local)** | 284 files |
| **API Endpoints** | 17 |
| **Frontend Pages** | 10 |
| **Database Tables** | 8 |
| **Admin Roles** | 3 |
| **Hero Slides** | 6 configurable |
| **Backup Retention** | 14 days |
| **Token Expiry** | 12 hours |
| **Payment Methods** | 4 (COD, bKash, Nagad, WhatsApp) |
| **Frontend Dependencies** | 3 production + 4 dev |
| **Backend Dependencies** | 4 production + 7 dev |

---

*Document generated on August 19, 2026. For operational details, see [HANDOVER.md](./HANDOVER.md). For issue history, see [ISSUES.md](./ISSUES.md).*
