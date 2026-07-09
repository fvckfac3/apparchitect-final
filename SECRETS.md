# Secrets setup for AppArchitect

This file lists every environment variable the app reads, where it goes, and which are safe to commit vs. must stay in Zo.

## The two-store rule

AppArchitect reads env vars from **two different places** depending on context:

1. **Local development** — `.env.local` in the app root (gitignored, never commit)
2. **Deployed builds (Vite)** — env vars are inlined into the bundle at build time, so the deployed bundle reads the values it was built with, not from a runtime `.env.local`

For deployed builds, set the secrets in **Zo Settings > Advanced** so the build process can read them from the shell environment. Vite inlines anything matching `VITE_*` at build time. The build will then bundle those values into the dist/ output.

## Variables

| Variable | Type | Required | Where | Notes |
|---|---|---|---|---|
| `VITE_SUPABASE_URL` | Public | Yes | Both | Supabase project URL. The current value is `https://qebpidcfzrgdqfptdcqi.supabase.co` (no trailing path). |
| `VITE_SUPABASE_ANON_KEY` | Public | Yes | Both | Supabase anonymous key. RLS-protected; safe to ship to client. |
| `VITE_SUPABASE_PROJECT_ID` | Public | No | Both | For reference only; URL slug is sufficient. |
| `VITE_ANTHROPIC_API_KEY` | Secret | Production only | Zo Settings > Advanced | Anthropic Claude API key. **Never commit**. The `VITE_` prefix means Vite will inline it into the JS bundle, which is acceptable for server-side AI provider keys that are scoped to your workspace but NOT safe for end-user-deployable keys. Use carefully. |
| `VITE_DEEPSEEK_API_KEY` | Secret | Optional | Zo Settings > Advanced | DeepSeek fallback provider. |
| `VITE_AI_PRIMARY` | Config | No | Both | Default `vercel-gateway`. Anthropic falls back, |
| `VITE_AI_FALLBACK` | Config | No | Both | Default `deepseek`. |

## `.env.local` (local dev)

`.env.local` already exists at the app root and is gitignored. It currently has:

```
VITE_SUPABASE_URL=https://qebpidcfzrgdqfptdcqi.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_oDLFm9EKahpar2lC9QIMtw_4R3dPj2z
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_SUPABASE_PROJECT_ID=qebpidcfzrgdqfptdcqi
```

Note the URL above is the **host** with no trailing path. The Supabase JS client adds `/rest/v1` and `/auth/v1` automatically.

## Production secrets (Zo Settings > Advanced)

When deploying via Zo, set the same variables in **Settings > Advanced** so Vite can read them at build time:

| Zo secret name | Value |
|---|---|
| `VITE_SUPABASE_URL` | `https://qebpidcfzrgdqfptdcqi.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `<your-anon-key>` |
| `VITE_SUPABASE_PROJECT_ID` | `qebpidcfzrgdqfptdcqi` |
| `VITE_ANTHROPIC_API_KEY` | `sk-ant-api03-...` |
| `VITE_DEEPSEEK_API_KEY` | `sk-...` |
| `VITE_AI_PRIMARY` | `anthropic` |
| `VITE_AI_FALLBACK` | `deepseek` |

To set them: open Settings > Advanced in the Zo Computer app, add each as a Secret (not an Access Token), then trigger a rebuild of the site.

## Security note

The `VITE_` prefix in Vite means the variable is exposed to the client at build time. That is fine for:

- Supabase anon key (RLS-protected)
- Provider keys that are scoped to your account/workspace and rate-limited (Anthropic, DeepSeek, etc.)

It is NOT fine for:

- Supabase service role key (full DB access)
- Any key that grants admin access

If the app ever needs server-side secret handling, it should call a Zo API route or a published backend service, not inline the secret.
