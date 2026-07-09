-- ============================================================================
-- 20260701130000_add_ai_calls_table.sql
--
-- Adds AI call tracking table for cost observability and DeepSeek fallback
-- logging (per user request: "yes, it was i tended to log if deepseek was
-- fallen back upon").
--
-- This migration is additive only — it does not modify existing tables.
-- The existing schema (profiles, projects, document_versions) remains the
-- canonical app data model.
--
-- Design notes:
-- 1. project_id is NULLABLE — an AI call may happen before a project is
--    saved (e.g. during the interview phase), and we still want to log it.
-- 2. provider is one of 'anthropic' | 'deepseek' — kept as text for now
--    rather than enum so adding new providers is a code change, not a
--    migration. (We discussed adding DeepSeek as a fallback to Anthropic.)
-- 3. success + error_code make it easy to compute provider health
--    dashboards later.
-- 4. tokens_in/tokens_out + cost_usd_micros support a future billing
--    view. Storing in micros (1/1,000,000 of a dollar) avoids float
--    precision issues.
-- 5. RLS is enabled but policies are permissive for INSERT (the user
--    is just logging their own calls) and restrictive for SELECT (only
--    the user who made the call can read it). This matches the
--    spec's Safety PRD principle: "the user owns their data".
-- ============================================================================

CREATE TABLE public.ai_calls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Ownership / scope
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,

  -- Call metadata
  provider TEXT NOT NULL CHECK (provider IN ('anthropic', 'deepseek')),
  model TEXT NOT NULL,
  endpoint TEXT,                          -- e.g. 'interview', 'prd-generation', 'review'
  is_fallback BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE if this call used the fallback provider

  -- Outcome
  success BOOLEAN NOT NULL,
  error_code TEXT,                        -- e.g. 'EXT_AI_TIMEOUT', 'EXT_RATE_LIMITED'
  latency_ms INTEGER,

  -- Usage / cost
  tokens_in INTEGER,
  tokens_out INTEGER,
  cost_usd_micros BIGINT,                 -- store as micros (1e-6 dollars) to avoid float drift

  -- Free-form context (capped to keep rows small)
  request_summary TEXT,
  response_summary TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX ai_calls_user_id_idx ON public.ai_calls(user_id);
CREATE INDEX ai_calls_project_id_idx ON public.ai_calls(project_id);
CREATE INDEX ai_calls_created_at_idx ON public.ai_calls(created_at DESC);
CREATE INDEX ai_calls_provider_success_idx ON public.ai_calls(provider, success);

-- RLS: user owns their call log
ALTER TABLE public.ai_calls ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own AI call log"
  ON public.ai_calls FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can insert own AI call log"
  ON public.ai_calls FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = user_id);

-- No update / delete policies: the call log is append-only from the
-- client's perspective. A future admin tool could add service-role
-- access for support diagnostics.

-- Comment for future readers
COMMENT ON TABLE public.ai_calls IS
  'Append-only log of every LLM call made by the app. Used for cost tracking, provider health, and DeepSeek fallback observability. RLS: user can only see their own calls.';
