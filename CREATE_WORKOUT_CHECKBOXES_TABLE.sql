-- Create workout_checkboxes table
CREATE TABLE IF NOT EXISTS public.workout_checkboxes (
  week_key TEXT NOT NULL,
  day_key TEXT NOT NULL,
  checked BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT NOT NULL DEFAULT 'unknown',
  PRIMARY KEY (week_key, day_key)
);

-- Enable Row Level Security
ALTER TABLE public.workout_checkboxes ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read
CREATE POLICY "Allow anonymous read for workout_checkboxes"
ON public.workout_checkboxes FOR SELECT
TO anon USING (true);

-- Policy: Allow anonymous insert
CREATE POLICY "Allow anonymous insert for workout_checkboxes"
ON public.workout_checkboxes FOR INSERT
TO anon WITH CHECK (true);

-- Policy: Allow anonymous update
CREATE POLICY "Allow anonymous update for workout_checkboxes"
ON public.workout_checkboxes FOR UPDATE
TO anon USING (true) WITH CHECK (true);
