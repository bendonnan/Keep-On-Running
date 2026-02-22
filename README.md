# Running PWA Demo

A minimal Progressive Web App that demonstrates:
- Installable PWA on iPhone + Android
- Real-time cloud database sync via Supabase
- Cross-device data synchronization

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Get these values from your Supabase project:
- Go to https://app.supabase.com
- Select your project
- Settings → API
- Copy "Project URL" and "anon public" key

### 3. Set Up Supabase Database

Run this SQL in your Supabase SQL Editor:

```sql
-- Create the table
CREATE TABLE IF NOT EXISTS public.app_state (
  id INTEGER PRIMARY KEY,
  training_status TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by TEXT NOT NULL DEFAULT 'unknown'
);

-- Enable Row Level Security
ALTER TABLE public.app_state ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous read for row id=1
CREATE POLICY "Allow anonymous read for id=1"
ON public.app_state
FOR SELECT
TO anon
USING (id = 1);

-- Policy: Allow anonymous insert for row id=1
CREATE POLICY "Allow anonymous insert for id=1"
ON public.app_state
FOR INSERT
TO anon
WITH CHECK (id = 1);

-- Policy: Allow anonymous update for row id=1
CREATE POLICY "Allow anonymous update for id=1"
ON public.app_state
FOR UPDATE
TO anon
USING (id = 1)
WITH CHECK (id = 1);

-- Insert default row if it doesn't exist
INSERT INTO public.app_state (id, training_status, updated_by, updated_at)
VALUES (1, 'Planned', 'system', NOW())
ON CONFLICT (id) DO NOTHING;
```

### 4. Create Icons

Create two PNG icons and place them in `public/icons/`:
- `icon-192.png` (192x192 pixels)
- `icon-512.png` (512x512 pixels)

You can:
- Use an online PWA icon generator
- Create simple colored squares with text
- Use any design tool

### 5. Run Locally

```bash
npm run dev
```

The app will be available at `http://localhost:5173` and on your network at `http://YOUR_IP:5173`

### 6. Build for Production

```bash
npm run build
```

## Deployment to Vercel

### Prerequisites

Install Vercel CLI:
```bash
npm i -g vercel
```

### Deploy Steps

1. **Login to Vercel:**
   ```bash
   vercel login
   ```

2. **Deploy:**
   ```bash
   vercel
   ```
   Follow the prompts (use defaults for most questions).

3. **Set Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `VITE_SUPABASE_URL` = your Supabase project URL
     - `VITE_SUPABASE_ANON_KEY` = your Supabase anon key

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

5. Your app will be live at `https://your-project.vercel.app`

## Installing on iPhone

1. Open **Safari** on your iPhone
2. Navigate to your deployed Vercel URL (HTTPS required)
3. Tap the **Share** button (square with arrow pointing up)
4. Scroll down and tap **"Add to Home Screen"**
5. Edit the name if desired (default: "Running PWA")
6. Tap **"Add"**
7. The app icon will appear on your home screen
8. Open it like a native app

**Note:** PWA installation only works over HTTPS, so you must deploy to Vercel (or another HTTPS host) first.

## Installing on Android

1. Open **Chrome** on your Android device
2. Navigate to your deployed Vercel URL (HTTPS required)
3. Chrome may show an install banner at the bottom — tap **"Install"**
4. If no banner appears:
   - Tap the menu (three dots) in the top right
   - Tap **"Install app"** or **"Add to Home screen"**
5. Confirm installation
6. The app icon will appear on your home screen
7. Open it like a native app

## Testing Cross-Device Sync

1. Install the app on two devices (iPhone + Android)
2. On device 1, select a status and tap "Save"
3. On device 2, tap "Refresh"
4. You should see the updated status from device 1
5. Change the status on device 2 and save
6. Refresh on device 1 to see the update

## Project Structure

```
.
├── index.html          # HTML with Apple meta tags
├── vite.config.js      # Vite + PWA configuration
├── package.json        # Dependencies
├── src/
│   ├── main.jsx       # React entry point
│   ├── App.jsx        # Main app component
│   ├── supabaseClient.js  # Supabase client
│   └── styles.css     # Styling
└── public/
    └── icons/         # PWA icons (192x192, 512x512)
```

## Features

- ✅ Installable PWA (iPhone + Android)
- ✅ Service Worker with offline support
- ✅ Real-time cloud database sync
- ✅ Cross-device synchronization
- ✅ Offline detection
- ✅ Device identification
- ✅ Row Level Security (RLS) policies

## Troubleshooting

**PWA won't install:**
- Ensure you're using HTTPS (required for PWA)
- Check that icons exist in `public/icons/`
- Verify manifest is generated (check browser DevTools → Application → Manifest)

**Database errors:**
- Verify RLS policies are created correctly
- Check that environment variables are set
- Ensure the default row (id=1) exists

**Service Worker not registering:**
- Clear browser cache
- Check browser console for errors
- Verify `vite-plugin-pwa` is configured correctly
