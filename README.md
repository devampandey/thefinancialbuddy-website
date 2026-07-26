# The Financial Buddy

Next.js + Tailwind source for thefinancialbuddy.com.

## Run locally

Requires Node.js 18+.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Deploy to Vercel (recommended path)

1. Push this folder to a GitHub repo (create one on github.com, then):
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to vercel.com → New Project → Import the GitHub repo. Vercel
   auto-detects Next.js — no config needed. Click Deploy.
3. In the Vercel project → Settings → Domains, add:
   - `thefinancialbuddy.com`
   - `www.thefinancialbuddy.com`
4. In Hostinger (Domains → your domain → DNS / Zone Editor), add:
   - A record: `@` → `76.76.21.21`
   - CNAME record: `www` → `cname.vercel-dns.com`
5. Back in Vercel, click Refresh next to the domain. Usually verifies within
   minutes; can take a few hours to fully propagate.

Every future `git push` to `main` auto-deploys — no manual redeploy step.

## Project structure

```
app/                    Next.js App Router pages
  page.js               Home
  tools/                Tools index + individual calculator pages
  guides/                Guides index + individual articles
  about/, contact/, privacy/
components/             Header, Footer, calculator components
```

## Adding a new guide

Duplicate `app/guides/emergency-fund/` as `app/guides/your-slug/`, edit the
content, then add an entry to the `guides` array in `app/guides/page.js` (and
`featuredGuides` in `app/page.js` if it should show on the home page).

## Adding a new calculator

Build the interactive logic as a `"use client"` component in `components/`,
then wrap it in a page under `app/tools/your-tool/page.js` with explainer
copy above/below it (this pairing is what makes tool pages rank in search —
see the roadmap doc for why).

## Notes

- Legal pages (`/privacy`) contain placeholder text — have it reviewed before
  relying on it, especially once ad networks or real user data collection are
  involved.
- Add Google Analytics (GA4) and Search Console verification before public
  launch — most ad networks require GA4 history to evaluate applications.
