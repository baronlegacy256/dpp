# Digital Product Passport (DPP) demonstrator

A demo web app where each product gets a unique ID, a QR code, and a public “passport” page showing its details and life-cycle event timeline. Authorized actors can add events using a shared demo passcode.

**Stack:** Next.js (App Router) + TypeScript + Tailwind CSS, Supabase (Postgres) via `@supabase/supabase-js` (no ORM), `qrcode` for QR generation. Deploy target: Vercel.

## Features
- **Landing (`/`)**: lists all products with links to their passports.
- **Register (`/register`)**: form (name, model, manufacturer + dynamic fields from industry config). On submit creates the product and shows its unique ID and QR code with a download button.
- **Passport (`/passport/[id]`)**: public, mobile-first page showing product details, unique ID, QR code, and a vertical event timeline (newest first). Friendly 404 for unknown IDs.
- **Add event (`/passport/[id]/add-event`)**: form to add an event (type from config, actor, location, notes).
- **API routes**: `POST /api/products`, `POST /api/events` (validate input, write to Supabase).
- **QR codes** encode: `${NEXT_PUBLIC_BASE_URL}/passport/${id}`.

## Project structure (key files)
- `app/` — Next.js App Router pages and API routes
  - `app/page.tsx` — landing/product list
  - `app/register/page.tsx` — product registration + QR
  - `app/passport/[id]/page.tsx` — public passport + timeline
  - `app/passport/[id]/add-event/page.tsx` — add event form
  - `app/api/products/route.ts`, `app/api/events/route.ts` — server write endpoints
- `lib/industry.ts` — **industry config** (reusable template)
- `lib/supabaseAdmin.ts` — server-only Supabase admin client
- `lib/types.ts` — shared DB types
- `supabase/schema.sql` — database schema
- `supabase/seed.sql` — sample seed data (2 products, 3–4 events each)
- `.env.example` — required environment variables

## Industry config (reusable template)
`lib/industry.ts` exports one config object:
- `productFields`: `{ key, label, type }[]` stored inside `products.attributes`
- `eventTypes`: allowed event types with display labels (and timeline dot color)

**Default:** generic “Electronics”. Forms and the passport page render from this config, so switching industry = editing this one file.

## Prerequisites
- Node.js 18+ and npm
- A Supabase project (Postgres)

## Local setup

### 1) Install dependencies
```bash
npm install
```

### 2) Configure environment variables
Copy `.env.example` to `.env.local` and fill in values:

```bash
# Windows PowerShell
Copy-Item .env.example .env.local
# macOS/Linux
# cp .env.example .env.local
```

`.env.local`:
```env
NEXT_PUBLIC_BASE_URL=http://localhost:3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DEMO_PASSCODE=changeme
```

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: Supabase Dashboard → **Project Settings → API** (use the **service_role** key; keep it secret).
- `DEMO_PASSCODE`: shared passcode required for write actions (register, add event).
- `NEXT_PUBLIC_BASE_URL`: base URL used to encode QR codes (use your deployed URL on Vercel).

### 3) Create database schema and seed data
In Supabase Dashboard → **SQL Editor**, run:
1. `supabase/schema.sql`
2. `supabase/seed.sql`

This creates `products` and `events` tables and inserts sample data (including fixed IDs you can use for testing).

### 4) Run the app
```bash
npm run dev
```
Open http://localhost:3000

## Quick test (local)
- **Landing**: http://localhost:3000 — lists products
- **Seeded passports**:
  - http://localhost:3000/passport/11111111-1111-1111-1111-111111111111
  - http://localhost:3000/passport/22222222-2222-2222-2222-222222222222
- **Register**: http://localhost:3000/register — create a product (requires `DEMO_PASSCODE`), view ID + QR, download QR
- **Add event**: http://localhost:3000/passport/<id>/add-event — add a timeline event (requires `DEMO_PASSCODE`)
- **404**: visit a non-existent passport ID to see the friendly not-found page

## Security & data access notes
- **Service role key is server-only**: used only in server code (`lib/supabaseAdmin.ts`, API route handlers/server components). It is never exposed to the browser.
- **Writes require passcode**: `/register` and `/passport/[id]/add-event` submit the `DEMO_PASSCODE` which is validated server-side by the API routes.
- **Reads are public**: passport pages and product listing are publicly readable (demo behavior).
- **No auth libraries / no extra frameworks** are used by design.

## Deploy to Vercel

1. **Push the project to Git** (GitHub/GitLab/Bitbucket).
2. In [Vercel](https://vercel.com), **Add New Project** and import the repository.
3. **Framework preset**: Next.js (auto-detected). Build settings can remain default (`npm run build`).
4. **Configure Environment Variables** in Vercel Project Settings (for Production/Preview as needed):
   - `NEXT_PUBLIC_BASE_URL` = your deployed URL (e.g. `https://your-app.vercel.app`)
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service role key
   - `DEMO_PASSCODE` = your chosen shared passcode
5. **Deploy**. After deployment, confirm:
   - Landing lists products (if schema/seed applied)
   - Registering a product generates a QR that points to the deployed passport URL
   - Passports and timeline render correctly on mobile
   - Add-event flow works with the passcode

> Note: Ensure `supabase/schema.sql` (and optionally `seed.sql`) has been run against the Supabase project used by your Vercel environment.

## Scripts
- `npm run dev` — start development server
- `npm run build` — production build
- `npm run start` — start production server
- `npm run lint` — lint (if configured)

## Notes
- This is a demonstrator/template: keep the implementation simple and adjust `lib/industry.ts` to model different product domains.
- API and UI return clear messages for failed DB calls, invalid input, and incorrect passcodes.
