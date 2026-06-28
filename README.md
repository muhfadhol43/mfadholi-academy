# Mfadholi.Dev Academy

Platform LMS Bahasa Jepang — Next.js 15 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + Supabase.

## Tech Stack

- **Framework**: Next.js 15 (App Router, Server Actions)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **Database & Auth**: Supabase (Postgres, Auth, Storage, RLS)
- **Form & Validasi**: React Hook Form + Zod
- **Data Fetching**: React Query (client) + Server Components (server)
- **Animasi**: Framer Motion
- **Icon**: Lucide Icons
- **Chart**: Recharts

## 1. Setup Database Supabase

1. Buat project baru di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, jalankan file migrasi secara berurutan:
   - `supabase/migrations/0001_init_schema.sql`
   - `supabase/migrations/0002_rls_policies.sql`
   - `supabase/migrations/0003_storage_buckets.sql`
   - `supabase/migrations/0004_helper_functions.sql`
3. Jalankan `supabase/seed/seed.sql` untuk data contoh (opsional).
4. Buat akun melalui halaman **Register**, lalu jadikan admin secara manual:
   ```sql
   update profiles set role = 'admin' where id = '<auth_user_uuid>';
   ```
5. Aktifkan provider **Google OAuth** di Supabase Dashboard → Authentication → Providers, lalu set redirect URL:
   ```
   https://<your-domain>/auth/callback
   ```

## 2. Setup Environment Variables

Salin `.env.local.example` menjadi `.env.local` dan isi:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> `SUPABASE_SERVICE_ROLE_KEY` hanya digunakan di server (admin actions seperti hapus user) — jangan pernah expose ke client.

## 3. Install & Jalankan Lokal

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## 4. Struktur Folder

```
src/
  app/
    (auth)/         -> login, register, reset-password, callback
    (marketing)/    -> landing page & course listing publik
    (student)/      -> dashboard, courses player, bookmarks, certificates, settings
    (admin)/        -> admin dashboard & seluruh CRUD
  components/
    ui/             -> primitive shadcn/ui components
    layout/         -> navbar, footer
    landing/        -> section landing page
    dashboard/      -> komponen dashboard siswa
    admin/          -> komponen admin (forms, tables, charts)
    course/         -> komponen pembelajaran (video, audio, vocab, grammar)
    quiz/           -> quiz player
  lib/
    supabase/       -> client, server, middleware helper
    actions/        -> server actions & data queries
    validations/    -> Zod schemas
  types/            -> TypeScript types (database.types.ts)
supabase/
  migrations/       -> SQL schema, RLS, storage, functions
  seed/             -> seed data
```

## 5. Deploy ke Vercel

1. Push project ke GitHub repository.
2. Buka [vercel.com](https://vercel.com) → **New Project** → import repository.
3. Set **Environment Variables** yang sama seperti `.env.local` di Vercel Project Settings.
4. Set `NEXT_PUBLIC_SITE_URL` menjadi domain production, contoh: `https://academy.mfadholi.dev`.
5. Update redirect URL Google OAuth & email template di Supabase agar mengarah ke domain production.
6. Klik **Deploy**. Vercel akan otomatis mendeteksi Next.js dan menjalankan `next build`.
7. Setelah deploy, cek `/sitemap.xml` dan `/robots.txt` sudah tergenerate otomatis.

## 6. Catatan Keamanan

- Seluruh tabel menggunakan **Row Level Security (RLS)** — admin memiliki akses penuh, siswa hanya bisa mengakses data miliknya sendiri.
- Validasi input dilakukan di **client (Zod + React Hook Form)** dan **server (Zod ulang di Server Action)**.
- Upload file (thumbnail, PDF, audio) divalidasi tipe & ukuran melalui Supabase Storage bucket policy.
- Role admin diverifikasi ulang di setiap Server Action (`assertAdmin()`) — tidak hanya mengandalkan UI.

## 7. Lisensi

Proprietary — © Mfadholi.Dev Academy.
