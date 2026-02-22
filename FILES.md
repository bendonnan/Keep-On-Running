# Complete File Listing with Contents

This document contains the full contents of every file in the project.

---

## package.json

```json
{
  "name": "running-pwa-demo",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite --host 0.0.0.0",
    "build": "vite build",
    "preview": "vite preview --host 0.0.0.0"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.1",
    "vite": "^5.0.8",
    "vite-plugin-pwa": "^0.17.4"
  }
}
```

---

## vite.config.js

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/*.png'],
      manifest: {
        name: 'Running PWA Demo',
        short_name: 'Running PWA',
        description: 'Running training status PWA demo',
        theme_color: '#000000',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ]
})
```

---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <meta name="description" content="Running PWA Demo - Training Status Tracker" />
  
  <!-- PWA Meta Tags -->
  <meta name="theme-color" content="#000000" />
  
  <!-- Apple PWA Meta Tags -->
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
  <meta name="apple-mobile-web-app-title" content="Running PWA" />
  <link rel="apple-touch-icon" href="/icons/icon-192.png" />
  
  <title>Running PWA Demo</title>
  <link rel="icon" type="image/png" href="/icons/icon-192.png" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

---

## src/main.jsx

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

---

## src/App.jsx

```javascript
import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

const TRAINING_STATUS_OPTIONS = [
  'Planned',
  'Done',
  'Skipped',
  'Injured',
  'Rest Day'
]

const DEFAULT_DEVICE_LABELS = ['Ben iPhone', 'Wife Android']

function App() {
  const [selectedStatus, setSelectedStatus] = useState('Planned')
  const [loadedValue, setLoadedValue] = useState(null)
  const [lastSavedAt, setLastSavedAt] = useState(null)
  const [lastSavedBy, setLastSavedBy] = useState(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)
  const [deviceLabel, setDeviceLabel] = useState(null)
  const [showLabelPrompt, setShowLabelPrompt] = useState(false)
  const [labelInput, setLabelInput] = useState('')

  // Initialize device label
  useEffect(() => {
    const stored = localStorage.getItem('deviceLabel')
    if (stored) {
      setDeviceLabel(stored)
    } else {
      setShowLabelPrompt(true)
    }
  }, [])

  // Network status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Load initial data
  useEffect(() => {
    if (deviceLabel) {
      loadData()
    }
  }, [deviceLabel])

  const loadData = async () => {
    if (!isOnline) {
      setError('Cannot load data while offline')
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Try to fetch row with id=1
      const { data, error: fetchError } = await supabase
        .from('app_state')
        .select('*')
        .eq('id', 1)
        .single()

      if (fetchError) {
        // If row doesn't exist, create it
        if (fetchError.code === 'PGRST116') {
          const { data: newData, error: insertError } = await supabase
            .from('app_state')
            .insert({
              id: 1,
              training_status: 'Planned',
              updated_by: deviceLabel || 'unknown',
              updated_at: new Date().toISOString()
            })
            .select()
            .single()

          if (insertError) {
            throw insertError
          }

          setLoadedValue(newData.training_status)
          setSelectedStatus(newData.training_status)
          setLastSavedAt(newData.updated_at)
          setLastSavedBy(newData.updated_by)
        } else {
          throw fetchError
        }
      } else {
        setLoadedValue(data.training_status)
        setSelectedStatus(data.training_status)
        setLastSavedAt(data.updated_at)
        setLastSavedBy(data.updated_by)
      }
    } catch (err) {
      setError(`Load error: ${err.message}`)
      console.error('Load error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!isOnline) {
      setError('Cannot save while offline. Please check your connection.')
      return
    }

    if (!deviceLabel) {
      setError('Device label is required')
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      const { data, error: saveError } = await supabase
        .from('app_state')
        .upsert({
          id: 1,
          training_status: selectedStatus,
          updated_by: deviceLabel,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select()
        .single()

      if (saveError) {
        throw saveError
      }

      // Refresh data after save
      setLoadedValue(data.training_status)
      setLastSavedAt(data.updated_at)
      setLastSavedBy(data.updated_by)
    } catch (err) {
      setError(`Save error: ${err.message}`)
      console.error('Save error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleLabelSubmit = () => {
    if (labelInput.trim()) {
      const label = labelInput.trim()
      localStorage.setItem('deviceLabel', label)
      setDeviceLabel(label)
      setShowLabelPrompt(false)
      setLabelInput('')
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    try {
      const date = new Date(dateString)
      return date.toLocaleString()
    } catch {
      return dateString
    }
  }

  if (showLabelPrompt) {
    return (
      <div className="app">
        <div className="card">
          <h1>Device Label</h1>
          <p>Enter a label to identify this device:</p>
          <div className="label-suggestions">
            {DEFAULT_DEVICE_LABELS.map((label) => (
              <button
                key={label}
                className="suggestion-btn"
                onClick={() => {
                  localStorage.setItem('deviceLabel', label)
                  setDeviceLabel(label)
                  setShowLabelPrompt(false)
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="label-input-group">
            <input
              type="text"
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
              placeholder="Or enter custom label"
              className="label-input"
              onKeyPress={(e) => e.key === 'Enter' && handleLabelSubmit()}
            />
            <button
              onClick={handleLabelSubmit}
              className="submit-btn"
              disabled={!labelInput.trim()}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="card">
        <h1>Running PWA Demo</h1>

        <div className="form-group">
          <label htmlFor="training-status">Today's Training Status</label>
          <select
            id="training-status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="dropdown"
            disabled={isLoading || isSaving}
          >
            {TRAINING_STATUS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="button-group">
          <button
            onClick={handleSave}
            disabled={isLoading || isSaving || !isOnline}
            className="btn btn-primary"
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
          <button
            onClick={loadData}
            disabled={isLoading || isSaving || !isOnline}
            className="btn btn-secondary"
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>

        <div className="status-area">
          <h2>Status</h2>
          <div className="status-item">
            <span className="status-label">Loaded value:</span>
            <span className="status-value">
              {isLoading ? 'Loading...' : (loadedValue || 'None')}
            </span>
          </div>
          <div className="status-item">
            <span className="status-label">Last saved at:</span>
            <span className="status-value">{formatDate(lastSavedAt)}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Last saved by:</span>
            <span className="status-value">{lastSavedBy || 'Unknown'}</span>
          </div>
          <div className="status-item">
            <span className="status-label">Network:</span>
            <span className={`status-value ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
```

---

## src/supabaseClient.js

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

---

## src/styles.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  padding: 20px;
}

.app {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 40px);
}

.card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 28px;
  margin-bottom: 24px;
  text-align: center;
  color: #333;
}

h2 {
  font-size: 20px;
  margin-top: 24px;
  margin-bottom: 16px;
  color: #333;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #333;
}

.dropdown {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.dropdown:focus {
  outline: none;
  border-color: #667eea;
}

.dropdown:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
}

.button-group {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.btn {
  flex: 1;
  padding: 14px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  min-height: 48px;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background: #f0f0f0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #e0e0e0;
  transform: translateY(-1px);
}

.btn-secondary:disabled {
  background: #f5f5f5;
  cursor: not-allowed;
  color: #999;
}

.status-area {
  border-top: 2px solid #eee;
  padding-top: 20px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.status-item:last-child {
  border-bottom: none;
}

.status-label {
  font-weight: 600;
  color: #666;
}

.status-value {
  color: #333;
  text-align: right;
  flex: 1;
  margin-left: 16px;
}

.status-value.online {
  color: #10b981;
  font-weight: 600;
}

.status-value.offline {
  color: #ef4444;
  font-weight: 600;
}

.error-message {
  margin-top: 16px;
  padding: 12px;
  background: #fee;
  border: 1px solid #fcc;
  border-radius: 8px;
  color: #c33;
  font-size: 14px;
}

.label-suggestions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.suggestion-btn {
  padding: 12px;
  font-size: 16px;
  border: 2px solid #667eea;
  border-radius: 8px;
  background: white;
  color: #667eea;
  cursor: pointer;
  transition: all 0.2s;
}

.suggestion-btn:hover {
  background: #667eea;
  color: white;
}

.label-input-group {
  display: flex;
  gap: 8px;
}

.label-input {
  flex: 1;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ddd;
  border-radius: 8px;
}

.label-input:focus {
  outline: none;
  border-color: #667eea;
}

.submit-btn {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  background: #667eea;
  color: white;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #5568d3;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

@media (max-width: 480px) {
  .card {
    padding: 20px;
  }

  h1 {
    font-size: 24px;
  }

  .button-group {
    flex-direction: column;
  }
}
```

---

## .gitignore

```
node_modules
dist
dist-ssr
*.local
.env
.DS_Store
```

---

## Files You Need to Create

### .env (create from template)
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### public/icons/icon-192.png
- 192x192 pixel PNG image
- Use `public/icons/icon-generator.html` to generate

### public/icons/icon-512.png
- 512x512 pixel PNG image
- Use `public/icons/icon-generator.html` to generate

---

## Additional Files

- `README.md` - Project documentation
- `SETUP.md` - Complete setup guide
- `FILES.md` - This file (complete file listing)
- `public/icons/icon-generator.html` - Icon generation tool
- `public/icons/README.md` - Icon creation instructions
- `scripts/generate-icons.js` - Icon generation script (optional)
