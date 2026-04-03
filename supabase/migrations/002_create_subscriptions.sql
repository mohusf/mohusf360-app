-- ═══ SUBSCRIPTIONS ═══
-- Managed by Lemon Squeezy webhooks (writes via service_role only)

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  lemon_squeezy_id TEXT UNIQUE,
  lemon_customer_id TEXT,
  status TEXT DEFAULT 'free' CHECK (status IN ('free', 'active', 'past_due', 'cancelled', 'expired')),
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro_monthly', 'pro_yearly')),
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-create subscription row on profile creation
CREATE OR REPLACE FUNCTION public.handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.subscriptions (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_profile();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- RLS: users can only READ their own subscription. All writes via service_role.
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "sub_select" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Enable realtime for subscription status changes
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscriptions;
