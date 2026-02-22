# Complete Setup Guide

## 📋 Supabase SQL Setup

Run this SQL in your Supabase SQL Editor (Settings → SQL Editor):

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

## 🚀 Local Run Commands

```bash
# 1. Install dependencies
npm install

# 2. Create .env file (copy from .env.example and add your Supabase credentials)
# Edit .env with:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# 3. Generate icons (open public/icons/icon-generator.html in browser and download both icons)

# 4. Run dev server (accessible on your network)
npm run dev

# Server will start on http://0.0.0.0:5173
# Access from phone: http://YOUR_COMPUTER_IP:5173
# Find your IP: ipconfig (Windows) or ifconfig (Mac/Linux)
```

## ☁️ Vercel Deploy Steps

### Prerequisites
```bash
npm i -g vercel
```

### Deployment
```bash
# 1. Login to Vercel
vercel login

# 2. Deploy (follow prompts)
vercel

# 3. Set Environment Variables in Vercel Dashboard:
#    - Go to: Vercel Dashboard → Your Project → Settings → Environment Variables
#    - Add:
#      VITE_SUPABASE_URL = your_supabase_project_url
#      VITE_SUPABASE_ANON_KEY = your_supabase_anon_key

# 4. Redeploy with environment variables
vercel --prod

# Your app will be live at: https://your-project.vercel.app
```

## 📱 iPhone Install Steps

1. Open **Safari** on iPhone (Chrome won't work for PWA install on iOS)
2. Navigate to your deployed Vercel URL (must be HTTPS)
3. Tap the **Share** button (square with arrow pointing up) at the bottom
4. Scroll down in the share menu
5. Tap **"Add to Home Screen"**
6. Edit the name if desired (default will be "Running PWA")
7. Tap **"Add"** in the top right
8. The app icon will appear on your home screen
9. Open it like a native app - it will run in standalone mode

**Important:** 
- Must use Safari (not Chrome)
- Must be HTTPS (deploy to Vercel first)
- Service worker will register automatically

## 🤖 Android Install Steps

1. Open **Chrome** on Android device
2. Navigate to your deployed Vercel URL (must be HTTPS)
3. Chrome may automatically show an install banner at the bottom - tap **"Install"**
4. If no banner appears:
   - Tap the menu (three dots) in the top right
   - Look for **"Install app"** or **"Add to Home screen"**
   - Tap it
5. Confirm installation in the popup
6. The app icon will appear on your home screen
7. Open it like a native app - it will run in standalone mode

**Important:**
- Must use Chrome
- Must be HTTPS (deploy to Vercel first)
- Service worker will register automatically

## 🎯 Testing Cross-Device Sync

1. Install the app on Device 1 (iPhone) - set device label to "Ben iPhone"
2. Install the app on Device 2 (Android) - set device label to "Wife Android"
3. On Device 1: Select "Done" from dropdown → Tap "Save"
4. On Device 2: Tap "Refresh" → Should see "Done" and "Last saved by: Ben iPhone"
5. On Device 2: Select "Skipped" → Tap "Save"
6. On Device 1: Tap "Refresh" → Should see "Skipped" and "Last saved by: Wife Android"

## 📁 All Files Created

Here's a complete list of all files in the project:

### Configuration Files
- `package.json` - Dependencies and scripts
- `vite.config.js` - Vite + PWA plugin configuration
- `.gitignore` - Git ignore rules
- `.env.example` - Environment variable template (create `.env` from this)

### Source Files
- `index.html` - HTML with Apple meta tags
- `src/main.jsx` - React entry point
- `src/App.jsx` - Main app component with all logic
- `src/supabaseClient.js` - Supabase client setup
- `src/styles.css` - Complete styling

### Public Assets
- `public/icons/icon-192.png` - **YOU NEED TO CREATE THIS** (192x192 PNG)
- `public/icons/icon-512.png` - **YOU NEED TO CREATE THIS** (512x512 PNG)
- `public/icons/icon-generator.html` - Tool to generate icons (open in browser)
- `public/icons/README.md` - Icon creation instructions

### Documentation
- `README.md` - Project documentation
- `SETUP.md` - This file (complete setup guide)
- `scripts/generate-icons.js` - Icon generation script (optional)

## ⚠️ Important Notes

1. **Icons Required**: You must create `icon-192.png` and `icon-512.png` in `public/icons/`
   - Open `public/icons/icon-generator.html` in your browser
   - Click "Download" buttons for both sizes
   - Save them as `icon-192.png` and `icon-512.png` in `public/icons/`

2. **Environment Variables**: Create `.env` file with your Supabase credentials
   - Get them from: Supabase Dashboard → Settings → API

3. **HTTPS Required**: PWA installation only works over HTTPS
   - Local dev works for testing, but installation requires Vercel deployment

4. **Service Worker**: Automatically registered by `vite-plugin-pwa`
   - No manual registration needed
   - Updates automatically when you deploy

5. **Database**: The app always reads/writes row `id=1`
   - First load creates the row if it doesn't exist
   - RLS policies restrict access to only row `id=1`

## 🐛 Troubleshooting

**PWA won't install:**
- ✅ Check HTTPS (required)
- ✅ Verify icons exist
- ✅ Check browser console for errors
- ✅ Clear browser cache

**Database connection fails:**
- ✅ Verify `.env` file exists with correct values
- ✅ Check RLS policies are created
- ✅ Verify default row (id=1) exists

**Service worker not working:**
- ✅ Clear browser cache
- ✅ Check DevTools → Application → Service Workers
- ✅ Verify `vite-plugin-pwa` is in dependencies

**Cross-device sync not working:**
- ✅ Both devices must be online
- ✅ Both devices must refresh to see updates
- ✅ Check Supabase dashboard to verify data is saving
