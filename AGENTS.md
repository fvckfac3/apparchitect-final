# AppArchitect — Merged Project Memory

## What this is

The AppArchitect app, pulled from `fvckfac3/apparchitect` and merged with
the local AppArchitect-Foundation workspace so the spec drives the app
instead of drifting from it.

## Architecture: 4 layers

```markdown
                    ┌──────────────────────────────┐
                    │  AppArchitect-Foundation     │  ← CANONICAL SPEC
                    │  ~/workspace/AppArchitect-   │
                    │  Foundation/                  │
                    └────────────┬─────────────────┘
                                 │  scripts/sync-spec.sh
                                 ▼
                    ┌──────────────────────────────┐
                    │  apparchitect-app/           │  ← THIS REPO
                    │  src/data/spec/              │
                    │  src/data/spec/loader.ts     │
                    └────────────┬─────────────────┘
                                 │  imported at build time
                                 ▼
                    ┌──────────────────────────────┐
                    │  Vite + React 18 + Supabase  │  ← THE RUNNING APP
                    │  src/components/, src/pages/ │
                    │  src/hooks/                  │
                    └────────────┬─────────────────┘
                                 │
                                 ▼
                    ┌──────────────────────────────┐
                    │  Supabase (qebpidcfzrgdq-     │  ← DATA
                    │  fptdcqi)                    │
                    └──────────────────────────────┘
```

## Three rules

1. **Foundation is source of truth.** To change a schema, agent prompt,
   or PRD template — edit the file in `AppArchitect-Foundation/` and
   run `bash scripts/sync-spec.sh` in the app.
2. **App reads spec, never duplicates it.** Legacy flat files have been
   deleted, loader is the only read path going forward.
3. **Secrets live in Zo Settings &gt; Advanced.** Never commit `.env.local`.
   `.env*` is in `.gitignore`. `.env.local` was previously tracked and
   has been untracked — do not re-add it.

## Monetization

- **New files:** `file apparchitect-app/src/data/spec/loader.ts`, `file apparchitect-app/scripts/sync-spec.sh`

## Quick links

- **App code:** `apparchitect-app/src/`
- **Spec bridge:** `apparchitect-app/src/data/spec/`
- **Loader:** `file apparchitect-app/src/data/spec/loader.ts`
- **Sync script:** `file apparchitect-app/scripts/sync-spec.sh`
- **Canonical spec:** `AppArchitect-Foundation/`
- **Marketing layer:** `AppArchitect/promotion/`
- **PRD suite (generated):** `apparchitect-prd-suite/`

## Local dev

```bash
cd ~/workspace/apparchitect-app
npm install
npm run dev      # Vite dev server on http://localhost:5173
```

Environment variables (read from `.env.local`):

- `VITE_SUPABASE_URL` — Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — public anon key (safe for client, RLS-protected)
- `VITE_SUPABASE_PROJECT_ID` — for reference

The corresponding values should be stored in Zo Settings &gt; Advanced
as secrets if you want to deploy this app from Zo.

## Supabase

- **Project ID:** `qebpidcfzrgdqfptdcqi`
- **Schema migrations:**
  - `file 20260601044647_create_apparchitect_schema.sql`
  - `file 20260601044647_create_ai_calls.sql`
- **Connection via Zo:** use the supabase Pipedream integration
  (`list_app_tools("supabase")`)

## Git

- **Remote:** `https://github.com/fvckfac3/apparchitect` (private)
- **Branch:** `main`
- **Clone date:** 2026-06-29
- **Last commit (merge):** 2026-06-29
- **Supabase provisioned:** pre-existing (see Supabase section)

## What changed in this merge

1. Cloned repo as new sibling `apparchitect-app/` (kept remote).
2. Untracked `.env.local` from git; added `.env*` to `.gitignore`;
   created `.env.local.example` with placeholders.
3. Created `src/data/spec/` bridge with 10 schemas, 17 agents, 51
   templates (v1 + v1.5 + v2) synced from `AppArchitect-Foundation/`.
4. Wrote `file src/data/spec/loader.ts` exposing typed `schemas`, `agents`,
   `v2Templates` objects for build-time imports.
5. Wrote `file scripts/sync-spec.sh` for one-command refresh from Foundation.
6. Wrote this AGENTS.md as the merged-project index.

## What still needs doing (not done in this pass)

- Replace inline TS templates (`file src/data/prd-templates-v2.ts` etc.)
  with imports from the loader. PR-sized change, easy follow-up.
- Decide on the AI provider (currently no API key wired for
  `file use-ai-interview.ts` / `file use-prd-generator-v2.ts`).
- Wire actual Supabase project ID into Zo secrets if deploying.
- Publish the merged app as a Zo Site for a stable URL.