# Catalog Admin (React + Tailwind)

A React rewrite of the original single-file `admin-3.html` catalog admin
tool. Same features — product CRUD backed by Supabase, image uploads via
Cloudinary's unsigned upload widget, and a Settings screen for connecting
your own project — reorganized into components, pages, and an API layer.

## Structure

```
src/
  api/products.js            Supabase queries (fetch/create/update/delete)
  lib/supabaseClient.js      Supabase client factory + table name
  lib/cloudinary.js          Loads & opens the Cloudinary upload widget
  context/SettingsContext.jsx  Supabase/Cloudinary config, persisted in localStorage
  hooks/useProducts.js       Loads products + exposes save/remove, wired to Settings
  constants/options.js       Category / RAM / processor / storage option lists
  components/
    layout/Header.jsx
    ui/                      Modal, StatusMessage, CheckboxGrid
    products/                ProductTable, ProductRow, EmptyState,
                              ImageUploader, ProductFormModal, ProductViewModal
    settings/SettingsModal.jsx
  pages/CatalogPage.jsx       Wires everything together
```

## Setup

```bash
npm install
npm run dev
```

No `.env` is needed. The app ships as a template: on first run it asks for
your Supabase and Cloudinary details plus a passphrase, encrypts them with
AES-GCM (WebCrypto, PBKDF2-derived key) and keeps them in that browser's
local storage only. The passphrase is never stored, so the details cannot be
read without it — and nothing is baked into the deployed bundle.

You'll be asked for the passphrase each time you open the panel. If you
forget it, clear it from the unlock screen and re-enter the project details.

## Access

Writes to the catalog are restricted to signed-in users by row level
security, so you also need a Supabase account:
Supabase → Authentication → Users → Add user (tick *Auto Confirm User*).

## Database

Expects a Supabase table named `products`
with columns: `Title`, `Category`, `Price`, `Tag`,
`Description`, `Featured`, `Image URL` (array), `Supported RAMs` (array),
`Supported Processors` (array), `Supported Storage` (array).

## Build

```bash
npm run build
```

Outputs static files to `dist/`, deployable anywhere (Vercel, Netlify,
GitHub Pages, etc).
