CREATE TABLE public.creative_radar_cycles (
  cycle_end date PRIMARY KEY CHECK (extract(isodow FROM cycle_end) = 7),
  cycle_start date GENERATED ALWAYS AS (cycle_end - 34) STORED,
  calculated_at timestamptz NOT NULL DEFAULT now(),
  report jsonb NOT NULL CHECK (jsonb_typeof(report) = 'object')
);
ALTER TABLE public.creative_radar_cycles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.creative_radar_cycles FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.creative_radar_cycles TO service_role;
