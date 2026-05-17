# exm-web

AP Biology AI tutor — early build. Web-first, English-only, targeting the May 2027 AP exam cycle.
Direction locked in EXM-2; foundations tracked in EXM-3.

## Stack

- [Next.js 16](https://nextjs.org) (App Router) + TypeScript + React 19
- [Tailwind CSS 4](https://tailwindcss.com) for styling
- ESLint (Next defaults) + Prettier for formatting
- GitHub Actions for CI and deploy
- Static export to GitHub Pages today; production will move to a server-capable host
  (likely Vercel) when the MVP needs Claude API routes — see EXM-4.

We picked this stack because it is boring, single-language, well-documented, and ships fast.
The AI tutor work happens server-side later; for now the homepage is static.

## Local development

```bash
git clone git@github.com:baobkt/exm-web.git
cd exm-web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command                | What it does                              |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Start dev server                          |
| `npm run build`        | Production build (static export to `out`) |
| `npm run lint`         | ESLint                                    |
| `npm run typecheck`    | `tsc --noEmit`                            |
| `npm run format`       | Prettier write                            |
| `npm run format:check` | Prettier check (CI uses this)             |

## CI

Two GitHub Actions workflows:

- **`ci.yml`** — runs on every push and pull request to `main`. Format check → lint → typecheck → build.
- **`pages.yml`** — runs on every push to `main`. Builds with `GITHUB_PAGES=true` so the
  static export uses the correct `basePath`, uploads `out/` as a Pages artifact, and deploys.

After the first successful deploy, the site is reachable at
`https://baobkt.github.io/exm-web/`.

## Deploying

Pushes to `main` automatically deploy. No manual step. To deploy on demand, trigger the
`pages` workflow from the Actions tab (`Run workflow`).

## Project layout

```
src/app/         # Next.js App Router pages
src/app/page.tsx # Homepage
public/          # Static assets shipped as-is
.github/         # CI + deploy workflows
next.config.ts   # Static export config, conditional basePath for GH Pages
```

## Telemetry

Anonymous, device-scoped session events go to PostHog Cloud (free tier). The client emits
`session_start`, `question_answered`, `session_complete`, `session_retry`, and
`session_abandoned`. Implementation: `src/lib/telemetry.ts` + `src/components/Telemetry.tsx`.

To enable in a deployment, set the following in the repo's Actions secrets/vars:

| Name                       | Where             | Value                                            |
| -------------------------- | ----------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_POSTHOG_KEY`  | Actions → Secrets | PostHog project API key (starts with `phc_`)     |
| `NEXT_PUBLIC_POSTHOG_HOST` | Actions → Vars    | Optional. Defaults to `https://us.i.posthog.com` |

If the key is unset the client is a silent no-op (in dev it logs to console for debugging),
so the build still works locally and in PR previews. See EXM-6 for the runbook.

## Next milestones

Tracked in Paperclip (EXM project):

- EXM-4 — Ship MVP v0.1 end-to-end student flow (Claude tutor + question bank + scoring).
- Vercel/Postgres setup decision deferred to EXM-4 so we don't pay for unused infra.
