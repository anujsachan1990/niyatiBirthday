# Supabase RSVP Setup

This project stores RSVP responses in Supabase and shows them on `/admin`.

## Architecture

```text
Guest fills HTML form  →  Supabase `rsvps` table  →  /admin dashboard (login required)
```

- **Public guests** can submit RSVPs (no account needed)
- **You (admin)** sign in on `/admin` to see who is coming and total guest count
- Row Level Security blocks strangers from reading responses

## 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a project
2. Open **SQL Editor** and run the contents of `supabase/schema.sql`

## 2. Create an admin user

1. In Supabase, open **Authentication → Users**
2. Click **Add user** and create an account for yourself (email + password)
3. Use this account to sign in at `/admin`

Optional: restrict reads to your email only — see the commented policy at the bottom of `supabase/schema.sql`.

## 3. Add API keys to the site

In Supabase, open **Project Settings → API** and copy:

- **Project URL** → `SUPABASE_URL`
- **anon public key** → `SUPABASE_ANON_KEY`

Never put the `service_role` key in frontend code.

### Local development (pick one)

**Option A — `.env` file (recommended)**

```bash
cp .env.example .env
# edit .env with your values
yarn build   # or yarn dev (create js/config.js for dev server — see below)
```

For `yarn dev`, also create `js/config.js` once:

```bash
cp js/config.example.js js/config.js
# paste the same values as in .env
```

**Option B — `js/config.js` only**

```bash
cp js/config.example.js js/config.js
# paste your Supabase URL and anon key
```

## 4. Run locally

```bash
yarn dev
```

- Site: `http://localhost:3000`
- Admin: `http://localhost:3000/admin/`

Submit a test RSVP, then sign in on the admin page to confirm it appears.

## 5. Deploy on Netlify

Because `js/config.js` is not in GitHub, set env vars in Netlify so the build can generate it:

1. Netlify → your site → **Site configuration** → **Environment variables**
2. Add:
   - `SUPABASE_URL` = your Supabase project URL
   - `SUPABASE_ANON_KEY` = your anon public key
3. **Deploys** → **Trigger deploy** → **Deploy site** (rebuild required)

Netlify already runs `yarn build` (see `netlify.toml`), which writes `dist/js/config.js` from those vars.

## 6. Deploy on Vercel

Same env var names in **Project Settings → Environment Variables**, then redeploy.

## 7. Manual / other hosts

```bash
yarn build
```

Deploy the `dist/` folder. Either set `SUPABASE_URL` and `SUPABASE_ANON_KEY` before building, or keep a local `js/config.js`.

## What `/admin` shows

| Card | Meaning |
|------|---------|
| Total responses | Every RSVP submitted |
| Households coming | Answered "Yes, joyfully" |
| Total guests | Sum of guest counts for yes responses |
| Cannot attend | Answered "Regretfully no" |

The table lists name, email, status, guests, message, and submission time. Use the filter for coming / declined only.

## Troubleshooting

**Form or admin says "not configured"**
- Local: `js/config.js` missing or still has placeholder values
- Netlify/Vercel: env vars not set, or site not redeployed after adding them

**Admin login works but no data**
- Confirm `supabase/schema.sql` was run
- Check browser console for RLS errors

**Insert fails**
- Confirm the `rsvps` table exists
- Check Supabase **Logs** for policy errors

## Files

| File | Purpose |
|------|---------|
| `supabase/schema.sql` | Database table + security policies |
| `js/config.js` | Your Supabase URL and anon key (local only) |
| `js/rsvp-form.js` | Form submit logic |
| `js/admin.js` | Admin dashboard logic |
| `admin/index.html` | Admin page UI |
