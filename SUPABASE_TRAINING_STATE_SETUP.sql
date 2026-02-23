-- Create table for training checkbox state (single-row JSON approach)
-- This ensures all devices read/write the same shared state

CREATE TABLE IF NOT EXISTS public.training_state (
  id INTEGER PRIMARY KEY,
  state JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.training_state ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read for row id=1
CREATE POLICY "Allow anonymous read for id=1"
ON public.training_state
FOR SELECT
TO anon
USING (id = 1);

-- Policy: Allow anonymous insert for row id=1
CREATE POLICY "Allow anonymous insert for id=1"
ON public.training_state
FOR INSERT
TO anon
WITH CHECK (id = 1);

-- Policy: Allow anonymous update for row id=1
CREATE POLICY "Allow anonymous update for id=1"
ON public.training_state
FOR UPDATE
TO anon
USING (id = 1)
WITH CHECK (id = 1);

-- Insert default row if it doesn't exist
INSERT INTO public.training_state (id, state, updated_at)
VALUES (1, '{}'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;

-- Optional: Drop the old workout_checkboxes table if it exists (uncomment if you want to clean up)
-- DROP TABLE IF EXISTS public.workout_checkboxes CASCADE;
