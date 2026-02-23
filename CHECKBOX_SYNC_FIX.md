# Checkbox Sync Fix - Summary

## Bug Identified

**Root Cause**: The checkbox states were being saved to **localStorage as a silent fallback** when Supabase operations failed or when offline. This caused each device to maintain its own separate state instead of sharing a single source of truth.

### Specific Issues:
1. **Silent localStorage fallback**: When Supabase errors occurred, the code silently fell back to localStorage without showing an error
2. **localStorage was always written**: Even when saving to Supabase, localStorage was written as "backup", causing confusion
3. **Multiple rows per week**: Using `workout_checkboxes` table with `(week_key, day_key)` composite key could lead to inconsistencies
4. **No error visibility**: Users couldn't see when database operations failed

## Solution Implemented

**Option A: Single-Row JSON State** (Fastest for demo)

### Database Structure:
- **Table**: `public.training_state`
- **Columns**:
  - `id` INTEGER PRIMARY KEY (always 1)
  - `state` JSONB (contains all checkbox values for all weeks)
  - `updated_at` TIMESTAMPTZ
- **Structure**: `{ "Feb 23": { "monday": true, "tuesday": false, ... }, "Mar 2": { ... } }`

### Key Changes:
1. ✅ **Removed all localStorage for checkboxes** - Only device label remains in localStorage
2. ✅ **Single source of truth** - All devices read/write row id=1
3. ✅ **Error visibility** - Shows clear error messages if database operations fail
4. ✅ **No silent fallbacks** - If offline or error occurs, shows error and doesn't save
5. ✅ **Debugging output** - Shows load time, save time, and DB state version
6. ✅ **Re-fetch after save** - Confirms save and gets latest state (handles concurrent updates)

## Files Changed

### 1. `src/App.jsx`
- Replaced `loadCheckboxStates()` to read from single JSON row
- Replaced `saveCheckboxState()` to write entire JSON state
- Removed all localStorage operations for checkboxes
- Added error state and debugging output
- Added `dbLoadTime`, `dbSaveTime`, and `dbError` state variables

### 2. `SUPABASE_TRAINING_STATE_SETUP.sql` (NEW)
- SQL migration to create the new table
- RLS policies for anonymous access to row id=1 only

## Database Setup Required

Run this SQL in your Supabase SQL Editor:

```sql
-- See SUPABASE_TRAINING_STATE_SETUP.sql for complete SQL
```

The SQL will:
1. Create `training_state` table with id=1 and JSONB state column
2. Enable RLS
3. Create policies allowing anonymous read/write ONLY for row id=1
4. Insert default empty state if row doesn't exist

## Testing

After deploying:
1. **On Phone**: Check some boxes → Should save to DB
2. **On Computer**: Refresh → Should see same checked boxes
3. **On Computer**: Check different boxes → Should save to DB
4. **On Phone**: Refresh → Should see computer's changes

The debugging output will show:
- "Loaded from DB at: [timestamp]"
- "Last saved to DB at: [timestamp]"
- "DB state version: [timestamp]"

If you see errors, they will be displayed in red above the notes section.

## Environment Variables

No changes needed - uses existing:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Deployment

1. Run the SQL migration in Supabase
2. Deploy updated code to Vercel
3. Test cross-device sync

## Notes

- **Offline behavior**: If offline, shows error and doesn't allow saving (prevents device-specific state)
- **Concurrent updates**: After saving, re-fetches to get latest state (handles case where two devices update simultaneously)
- **Device label**: Still stored in localStorage (device-specific, not shared state)
