CREATE TABLE public.creative_radar_settings (name text PRIMARY KEY, value jsonb NOT NULL);
ALTER TABLE public.creative_radar_settings ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.creative_radar_settings FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.creative_radar_settings TO service_role;
