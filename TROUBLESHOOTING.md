# Troubleshooting: Table Not Found Error

## Error: "Could not find the table 'public.training_state' in the schema cache"

This means the table hasn't been created in Supabase yet. Follow these steps:

## Step 1: Verify You're in the Right Project

1. Go to https://app.supabase.com
2. Make sure you're in the correct project (the one connected to your Vercel deployment)

## Step 2: Run the SQL Migration

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy and paste the ENTIRE SQL from `SUPABASE_TRAINING_STATE_SETUP.sql`
4. Click **Run** (or press Ctrl+Enter / Cmd+Enter)

## Step 3: Verify Table Was Created

1. In Supabase Dashboard, go to **Table Editor** (left sidebar)
2. You should see `training_state` in the list
3. Click on it - it should show:
   - `id` (integer, primary key)
   - `state` (jsonb)
   - `updated_at` (timestamptz)

## Step 4: Verify RLS Policies

1. In Supabase Dashboard, go to **Authentication** → **Policies**
2. Or in **Table Editor**, click on `training_state` → **Policies** tab
3. You should see 3 policies:
   - "Allow anonymous read for id=1"
   - "Allow anonymous insert for id=1"
   - "Allow anonymous update for id=1"

## Step 5: Check for Errors

If the SQL fails, check:
- Are you using the correct database? (Make sure you're in the right project)
- Do you have permission to create tables?
- Check the error message in the SQL Editor

## Alternative: Manual Table Creation

If the SQL script doesn't work, try creating the table manually:

1. Go to **Table Editor** → **New Table**
2. Name: `training_state`
3. Add columns:
   - `id` (type: int8, primary key, default: 1)
   - `state` (type: jsonb, default: '{}')
   - `updated_at` (type: timestamptz, default: now())
4. Save the table
5. Then go to **SQL Editor** and run just the RLS policies part:

```sql
ALTER TABLE public.training_state ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous read for id=1"
ON public.training_state FOR SELECT
TO anon USING (id = 1);

CREATE POLICY "Allow anonymous insert for id=1"
ON public.training_state FOR INSERT
TO anon WITH CHECK (id = 1);

CREATE POLICY "Allow anonymous update for id=1"
ON public.training_state FOR UPDATE
TO anon USING (id = 1) WITH CHECK (id = 1);

INSERT INTO public.training_state (id, state, updated_at)
VALUES (1, '{}'::jsonb, NOW())
ON CONFLICT (id) DO NOTHING;
```

## Still Having Issues?

1. **Clear browser cache** and refresh the app
2. **Check Supabase logs**: Go to **Logs** → **Postgres Logs** to see any errors
3. **Verify environment variables** in Vercel match your Supabase project
4. **Try a simple test query** in SQL Editor:
   ```sql
   SELECT * FROM public.training_state WHERE id = 1;
   ```
   (This should return one row or an empty result, not an error)
