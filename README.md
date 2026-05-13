# CampusCompany ERP

CampusCompany ERP is an offline-first desktop ERP application for colleges, institutes, training centers, startups, service companies and corporate administration teams.

## Features

- Electron + React + Node.js/Express desktop application.
- SQLite local database for offline operation.
- College modules for students, courses, admissions, fee receipts, dues and academic capacity tracking.
- Company modules for departments, employees, projects, shared services, inventory and assets.
- Excel workbook storage/export with separate sheets for students, fees, courses, employees, projects, assets, invoices and activity logs.
- CSV and XML export/import services, one-click Excel backup and scheduled automatic backups.
- Secure login with bcrypt password hashing and JWT sessions.
- Premium dashboard with fee collection, pending dues, active students, project budgets, course capacity, admissions pipeline, asset summary and inventory alerts.
- Fast fee/service billing with invoice numbers, QR code support, payment tracking, PDF output hook and receipt preview.
- Dark/light mode, responsive layout, smooth transitions, keyboard shortcuts, search and beginner-friendly workflows.

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

   - Email: `admin@campuscompany.local`
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

- `Ctrl/Cmd + B`: open Fees & Billing
- `Ctrl/Cmd + F`: focus global search
- `Ctrl/Cmd + I`: invoice workflow hook
