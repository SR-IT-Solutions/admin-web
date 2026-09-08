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
cp .env.example .env   # then fill in your real Supabase + Cloudinary values
npm run dev
```

`.env` values are just the **baked-in defaults** shown the first time the
app loads. If you'd rather configure it entirely from the UI, leave `.env`
blank — the app will open the Settings screen (gear icon) automatically and
save whatever you enter there to `localStorage`, exactly like the original
page did.

**Never commit your real `.env`** — it's already in `.gitignore`. If your
old `admin-3.html` had a real Supabase key hardcoded in it, treat that key
as public now and consider rotating it in Supabase (Project Settings → API).

## Database

Expects a Supabase table named `catelog` (this matches the table name in
the original app — rename it in `src/lib/supabaseClient.js` if you fix the
typo in your database) with columns: `Title`, `Category`, `Price`, `Tag`,
`Description`, `Featured`, `Image URL` (array), `Supported RAMs` (array),
`Supported Processors` (array), `Supported Storage` (array).

## Build

```bash
npm run build
```

Outputs static files to `dist/`, deployable anywhere (Vercel, Netlify,
GitHub Pages, etc).
