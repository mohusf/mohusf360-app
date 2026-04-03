-- ═══ USER DATA ═══
-- JSONB per domain (15 rows per user). Pro-only writes enforced via RLS.

CREATE TABLE IF NOT EXISTS public.user_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  domain TEXT NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, domain),
  CHECK (pg_column_size(data) < 512000) -- 500KB max per domain
);

-- Auto-update updated_at on write
CREATE OR REPLACE TRIGGER user_data_updated_at
  BEFORE UPDATE ON public.user_data
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS
ALTER TABLE public.user_data ENABLE ROW LEVEL SECURITY;

-- All authenticated users can READ their own data (includes expired Pro — data preserved)
CREATE POLICY "data_select" ON public.user_data
  FOR SELECT USING (auth.uid() = user_id);

-- Only Pro users can INSERT
CREATE POLICY "data_insert" ON public.user_data
  FOR INSERT WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND status IN ('active', 'past_due')
    )
  );

-- Only Pro users can UPDATE (prevent user_id spoofing via WITH CHECK)
CREATE POLICY "data_update" ON public.user_data
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND status IN ('active', 'past_due')
    )
  );

-- Only Pro users can DELETE
CREATE POLICY "data_delete" ON public.user_data
  FOR DELETE USING (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.subscriptions
      WHERE user_id = auth.uid()
      AND status IN ('active', 'past_due')
    )
  );

-- Enable realtime for multi-device sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_data;

-- ═══ DATA RETENTION CLEANUP ═══
-- Purge data for expired users after 90 days (run via pg_cron)
-- Schedule: SELECT cron.schedule('purge-expired-data', '0 3 * * *', $$
--   DELETE FROM public.user_data
--   WHERE user_id IN (
--     SELECT user_id FROM public.subscriptions
--     WHERE status = 'expired'
--     AND updated_at < now() - interval '90 days'
--   );
-- $$);
