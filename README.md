# GarmentPro ERP

GarmentPro ERP is a professional offline-first desktop billing and management application for garment factories, textile shops, clothing manufacturers, wholesalers, distributors, tailoring units, and garment export companies.

## Features

- Electron + React + Node.js/Express desktop application.
- SQLite local database for offline operation.
- Excel workbook storage/export with separate sheets for customers, billing, inventory, employees, orders, and production data.
- CSV and XML export/import services, one-click Excel backup, and scheduled automatic backups.
- Secure login with bcrypt password hashing and JWT sessions.
- Premium dashboard with sales, orders, pending payments, profit, stock alerts, production status, top products, and worker performance.
- Fast GST billing with invoice numbers, QR code support, payment tracking, return-ready invoice types, PDF output hook, and thermal-printer-friendly preview.
- Inventory management for SKU, barcode, size, color, fabric, stock in/out, warehouse, batch and low-stock alerts.
- Production tracking for cutting, stitching, finishing, packing, worker assignment, and daily reporting.
- Customer, supplier, employee, admin, reports, backup, settings, activity logging, and user guide screens.
- Dark/light mode, responsive layout, smooth transitions, keyboard shortcuts, search, and beginner-friendly workflows.

## Project structure

```text
frontend/   React UI, screens, styles and API client
backend/    Express APIs, services, middleware and scripts
database/   SQLite schema, seed data and local database bootstrap
exports/    Generated Excel, CSV, XML and PDF files
backups/    Automatic and one-click Excel backups
assets/     Branding, invoice and installer assets
modules/    Extension modules for printers, WhatsApp, AI and tax packs
electron/   Desktop shell, preload bridge and shortcuts
```

## Setup

1. Install Node.js 20+.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create the local SQLite database and sample demo data:

   ```bash
   npm run seed
   ```

4. Start the full desktop application:

   ```bash
   npm run dev
   ```

5. Login with:

   - Email: `admin@garmentpro.local`
   - Password: `admin123`

## Production build and installers

Build the renderer and create platform installers:

```bash
npm run dist
```

Electron Builder is configured for Windows NSIS, macOS DMG, and Linux AppImage/DEB packages. Generated installers are written to `installer/`.

## Data workflow

- SQLite is the primary offline database.
- Use **Reports** for Excel, CSV and XML exports.
- Use **Admin → Create Excel Backup Now** or `npm run backup` for one-click backups.
- The backend also schedules automatic Excel backups every 30 minutes while the API is running.

## Keyboard shortcuts

- `Ctrl/Cmd + B`: open Billing
- `Ctrl/Cmd + F`: focus global search
- `Ctrl/Cmd + I`: invoice workflow hook
