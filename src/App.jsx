import { useState, useEffect } from 'react'

const DEFAULT_DEVICE_LABELS = ['Ben iPhone', 'Wife Android']

const FUN_RUNS = [
  {
    date: 'Mar 1st',
    name: 'Geelong River Run',
    website: 'https://pbevents.com.au/geelong-river-run/'
  },
  {
    date: 'Mar 4th',
    name: 'Sunset Series - The Tan - Race 3',
    website: 'https://solemotive.com/pages/sunset-series-home'
  },
  {
    date: 'Mar 29th',
    name: 'Run For The Kids',
    website: 'https://www.runforthekids.com.au/'
  },
  {
    date: 'April 12th',
    name: 'Gumbuya World Running Festival',
    website: 'https://racehubaustralia.com/gumbuyaworldrunningfestival/'
  },
  {
    date: 'April 26th',
    name: 'Run The Tan',
    website: 'https://runthetan.net/'
  },
  {
    date: 'May 10th',
    name: "Mother's Day Classic - Melbourne",
    website: 'https://www.mothersdayclassic.com.au/'
  },
  {
    date: 'May 17th',
    name: 'Memory Walk and Jog - Melbourne',
    website: 'https://www.memorywalk.com.au/'
  },
  {
    date: 'Jul 19th',
    name: 'Run Melbourne',
    website: 'https://runmelbourne.com.au/'
  }
]

// Week training data
const WEEK_TRAINING_DATA = {
  'Feb 23': {
    monday: 'Easy 35 min (Zone 2)',
    tuesday: 'Strength',
    wednesday: 'Light intervals 4x400m @ 5K pace (reduced volume)',
    thursday: 'Light strength',
    friday: 'Easy 30 min',
    saturday: 'Rest',
    sunday: 'Mar 1 – River Run 5K @ Aerobic (Category C)',
    notes: 'C Race – Training stimulus'
  },
  'Mar 2': {
    monday: 'Recovery 30 min',
    tuesday: 'Strength (moderate)',
    wednesday: 'Mar 4 – Sunset Series 3.8K @ Aerobic (Category C)',
    thursday: 'Swim / Rest',
    friday: 'Easy 35 min',
    saturday: 'Rest',
    sunday: 'Long Run 8 km easy',
    notes: 'Aerobic focus'
  },
  'Mar 9': {
    monday: 'Easy 40 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 6x400m @ 5K pace',
    thursday: 'Strength',
    friday: 'Tempo 35 min (controlled)',
    saturday: 'Rest',
    sunday: 'Long Run 9 km easy',
    notes: 'Build week'
  },
  'Mar 16': {
    monday: 'Easy 35 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 5x600m @ slightly faster than 5K',
    thursday: 'Strength',
    friday: 'Easy 30 min',
    saturday: 'Rest',
    sunday: 'Long Run 9 km',
    notes: 'Build week'
  },
  'Mar 23': {
    monday: 'Easy 30 min',
    tuesday: 'Light strength',
    wednesday: 'Light intervals 4x400m',
    thursday: 'Light strength',
    friday: 'Easy 25 min',
    saturday: 'Rest',
    sunday: 'Mar 29 – 5K @ 90–95% (Category B)',
    notes: 'B Race'
  },
  'Mar 30': {
    monday: 'Recovery 30 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 6x400m',
    thursday: 'Strength',
    friday: 'Tempo 35 min',
    saturday: 'Rest',
    sunday: 'Long Run 10 km',
    notes: 'Resume build'
  },
  'Apr 6': {
    monday: 'Easy 40 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 5x800m @ 5K pace',
    thursday: 'Strength',
    friday: 'Easy 30 min',
    saturday: 'Rest',
    sunday: 'Apr 12 – 5K Aerobic (Category C)',
    notes: 'C Race'
  },
  'Apr 13': {
    monday: 'Easy 35 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 6x400m',
    thursday: 'Strength',
    friday: 'Tempo 35 min',
    saturday: 'Rest',
    sunday: 'Long Run 10 km',
    notes: 'Build week'
  },
  'Apr 20': {
    monday: 'Easy 30 min',
    tuesday: 'Light strength',
    wednesday: 'Light intervals 4x400m',
    thursday: 'Light strength',
    friday: 'Easy 25 min',
    saturday: 'Rest',
    sunday: 'Apr 26 – 3.8K @ 90% (Category B)',
    notes: 'B Race'
  },
  'Apr 27': {
    monday: 'Recovery 30 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 5x600m',
    thursday: 'Strength',
    friday: 'Tempo 35 min',
    saturday: 'Rest',
    sunday: 'Long Run 11 km',
    notes: 'Build week'
  },
  'May 4': {
    monday: 'Easy 30 min',
    tuesday: 'Light strength',
    wednesday: 'Light intervals 4x400m',
    thursday: 'Light strength',
    friday: 'Easy 25 min',
    saturday: 'Rest',
    sunday: 'May 10 – 4K @ 90% (Category B)',
    notes: 'B Race'
  },
  'May 11': {
    monday: 'Recovery 30 min',
    tuesday: 'Strength',
    wednesday: 'Easy 30 min',
    thursday: 'Light strength',
    friday: 'Easy 25 min',
    saturday: 'Rest',
    sunday: 'May 17 – 10K @ 85% (Category C aerobic)',
    notes: 'C Race – Aerobic Builder'
  },
  'May 18': {
    monday: 'Easy 40 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 6x800m @ 5K pace',
    thursday: 'Strength',
    friday: 'Tempo 40 min steady',
    saturday: 'Rest',
    sunday: 'Long Run 11 km',
    notes: 'Build 1'
  },
  'May 25': {
    monday: 'Easy 40 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 5x1km @ slightly faster than 5K',
    thursday: 'Strength',
    friday: 'Tempo 40 min (last 10 min strong)',
    saturday: 'Rest',
    sunday: 'Long Run 12 km',
    notes: 'Build 2 – volume increase'
  },
  'June 1': {
    monday: 'Easy 45 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 6x1km @ 5K pace (90 sec rest)',
    thursday: 'Strength',
    friday: 'Tempo 45 min steady',
    saturday: 'Rest',
    sunday: 'Long Run 12 km (last 2 km moderate)',
    notes: 'Peak aerobic load'
  },
  'June 8': {
    monday: 'Easy 40 min',
    tuesday: 'Light strength',
    wednesday: 'Intervals 4x1.2km @ 5K pace',
    thursday: 'Strength',
    friday: 'Tempo 40 min steady',
    saturday: 'Rest',
    sunday: 'Long Run 10 km',
    notes: 'Consolidation week'
  },
  'June 15': {
    monday: 'Easy 45 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 5x1km @ faster than 5K pace',
    thursday: 'Strength',
    friday: 'Tempo 35 min controlled',
    saturday: 'Rest',
    sunday: 'Long Run 11 km',
    notes: 'Sharpening phase'
  },
  'June 22': {
    monday: 'Easy 40 min',
    tuesday: 'Strength',
    wednesday: 'Intervals 4x1km @ 5K pace (controlled)',
    thursday: 'Strength',
    friday: 'Tempo 30 min steady',
    saturday: 'Rest',
    sunday: 'Long Run 10 km easy',
    notes: 'Deload week – absorb gains'
  },
  'June 29': {
    monday: 'Easy 35 min',
    tuesday: 'Light strength',
    wednesday: 'Intervals 4x800m sharp (not max)',
    thursday: 'Strength',
    friday: 'Tempo 30 min controlled',
    saturday: 'Rest',
    sunday: 'Long Run 9 km easy',
    notes: 'Pre-taper reduction'
  },
  'July 6': {
    monday: 'Easy 35 min',
    tuesday: 'Light strength',
    wednesday: 'Intervals 3x800m @ race pace',
    thursday: 'Rest',
    friday: 'Easy 25 min with 4 strides',
    saturday: 'Rest',
    sunday: 'Long Run 8 km easy',
    notes: 'Taper begins'
  },
  'July 13': {
    monday: 'Easy 30 min',
    tuesday: 'Light strength',
    wednesday: '4x400m sharp with full recovery',
    thursday: 'Rest',
    friday: 'Easy 20 min',
    saturday: 'Rest',
    sunday: 'July 19 – Run Melbourne 5.5K (Category A)',
    notes: 'A Race – Full Effort'
  }
}

// Function to generate week ranges starting from Mon 23rd Feb
const generateWeeks = () => {
  const weeks = []
  const currentYear = new Date().getFullYear()
  
  // Start date: Monday, February 23rd
  let startDate = new Date(currentYear, 1, 23) // Month is 0-indexed, so 1 = February
  
  // If we're past Feb 23 this year, use next year
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  if (today > startDate) {
    startDate = new Date(currentYear + 1, 1, 23)
  }
  
  // Ensure it's a Monday (day 1)
  const dayOfWeek = startDate.getDay()
  if (dayOfWeek !== 1) {
    // Adjust to the Monday of that week
    const diff = (1 - dayOfWeek + 7) % 7
    startDate.setDate(startDate.getDate() + diff)
  }
  
  // Generate weeks for the rest of the year
  const endOfYear = new Date(startDate.getFullYear(), 11, 31) // December 31st
  
  let currentWeekStart = new Date(startDate)
  
  while (currentWeekStart <= endOfYear) {
    const weekEnd = new Date(currentWeekStart)
    weekEnd.setDate(weekEnd.getDate() + 6) // Sunday (6 days after Monday)
    
    const formatDate = (date) => {
      const day = date.getDate()
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      const month = monthNames[date.getMonth()]
      const suffix = day === 1 || day === 21 || day === 31 ? 'st' :
                     day === 2 || day === 22 ? 'nd' :
                     day === 3 || day === 23 ? 'rd' : 'th'
      return `${day}${suffix} ${month}`
    }
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const startDayName = dayNames[currentWeekStart.getDay()]
    const endDayName = dayNames[weekEnd.getDay()]
    
    // Create key for training data lookup (e.g., "Feb 23", "Mar 2")
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const weekKey = `${monthNames[currentWeekStart.getMonth()]} ${currentWeekStart.getDate()}`
    
    weeks.push({
      start: currentWeekStart,
      end: weekEnd,
      label: `${startDayName} ${formatDate(currentWeekStart)} - ${endDayName} ${formatDate(weekEnd)}`,
      key: weekKey
    })
    
    // Move to next Monday
    currentWeekStart = new Date(currentWeekStart)
    currentWeekStart.setDate(currentWeekStart.getDate() + 7)
  }
  
  return weeks
}

function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [deviceLabel, setDeviceLabel] = useState(null)
  const [showLabelPrompt, setShowLabelPrompt] = useState(false)
  const [labelInput, setLabelInput] = useState('')
  const [currentPage, setCurrentPage] = useState(null)
  const [selectedWeek, setSelectedWeek] = useState(null)
  const [checkedDays, setCheckedDays] = useState({})

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

  const handleLabelSubmit = () => {
    if (labelInput.trim()) {
      const label = labelInput.trim()
      localStorage.setItem('deviceLabel', label)
      setDeviceLabel(label)
      setShowLabelPrompt(false)
      setLabelInput('')
    }
  }

  const handleMenuClick = (menuItem) => {
    setCurrentPage(menuItem)
  }

  const handleBackToMain = () => {
    setCurrentPage(null)
    setSelectedWeek(null)
  }

  const handleRefresh = () => {
    window.location.reload()
  }

  const handleRunClick = (website) => {
    window.open(website, '_blank', 'noopener,noreferrer')
  }

  // Load checked days from localStorage when week is selected
  useEffect(() => {
    if (selectedWeek && currentPage === 'Running Schedule') {
      const loaded = {}
      const dayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
      dayKeys.forEach(dayKey => {
        const storageKey = `workout_${selectedWeek}_${dayKey}`
        const value = localStorage.getItem(storageKey)
        loaded[dayKey] = value === 'true'
      })
      setCheckedDays(loaded)
    } else if (!selectedWeek) {
      setCheckedDays({})
    }
  }, [selectedWeek, currentPage])

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

  // Render Running Schedule page
  if (currentPage === 'Running Schedule') {
    const weeks = generateWeeks()
    const trainingData = selectedWeek ? WEEK_TRAINING_DATA[selectedWeek] : null
    
    // Show week detail view
    if (selectedWeek) {
      if (trainingData) {
        const days = [
          { name: 'Monday', key: 'monday', detail: trainingData.monday },
          { name: 'Tuesday', key: 'tuesday', detail: trainingData.tuesday },
          { name: 'Wednesday', key: 'wednesday', detail: trainingData.wednesday },
          { name: 'Thursday', key: 'thursday', detail: trainingData.thursday },
          { name: 'Friday', key: 'friday', detail: trainingData.friday },
          { name: 'Saturday', key: 'saturday', detail: trainingData.saturday },
          { name: 'Sunday', key: 'sunday', detail: trainingData.sunday }
        ]
        
        const handleDayCheck = (dayKey) => {
          const storageKey = `workout_${selectedWeek}_${dayKey}`
          const newValue = !checkedDays[dayKey]
          localStorage.setItem(storageKey, newValue.toString())
          setCheckedDays(prev => ({
            ...prev,
            [dayKey]: newValue
          }))
        }
        
        return (
          <div className="app">
            <div className="card">
              <h1>Week Starting: {selectedWeek}</h1>
              
              <div className="page-content">
                <button
                  className="back-btn"
                  onClick={() => setSelectedWeek(null)}
                >
                  Back to Weeks
                </button>
                
                <div className="week-details">
                  {days.map((day, index) => {
                    // Always read from localStorage as source of truth, with state as fallback
                    const storageKey = `workout_${selectedWeek}_${day.key}`
                    const storedValue = localStorage.getItem(storageKey)
                    const isChecked = storedValue === 'true' || checkedDays[day.key] === true
                    
                    return (
                      <div key={index} className="day-item">
                        <input
                          type="checkbox"
                          className="day-checkbox"
                          checked={isChecked}
                          onChange={() => handleDayCheck(day.key)}
                        />
                        <span className="day-name">{day.name}</span>
                        <span className={`day-detail ${isChecked ? 'completed' : ''}`}>
                          - {day.detail}
                        </span>
                      </div>
                    )
                  })}
                  
                  <div className="week-notes">
                    <strong>NOTES:</strong> {trainingData.notes}
                  </div>
                </div>
              </div>

              <div className="network-status">
                <span className="network-label">Network:</span>
                <span className={`network-value ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        )
      } else {
        // Week selected but no training data available
        return (
          <div className="app">
            <div className="card">
              <h1>Week Starting: {selectedWeek}</h1>
              
              <div className="page-content">
                <button
                  className="back-btn"
                  onClick={() => setSelectedWeek(null)}
                >
                  Back to Weeks
                </button>
                
                <div className="week-details">
                  <p>No training data available for this week.</p>
                </div>
              </div>

              <div className="network-status">
                <span className="network-label">Network:</span>
                <span className={`network-value ${isOnline ? 'online' : 'offline'}`}>
                  {isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        )
      }
    }
    
    // Show week list
    return (
      <div className="app">
        <div className="card">
          <h1>{currentPage}</h1>
          
          <div className="page-content">
            <button
              className="back-btn"
              onClick={handleBackToMain}
            >
              Back to Main
            </button>
            
            <div className="weeks-list">
              {weeks.map((week, index) => (
                <button
                  key={index}
                  className="week-btn"
                  onClick={() => {
                    setSelectedWeek(week.key)
                  }}
                >
                  {week.label}
                </button>
              ))}
            </div>
          </div>

          <div className="network-status">
            <span className="network-label">Network:</span>
            <span className={`network-value ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Render Events page
  if (currentPage === 'Events') {
    return (
      <div className="app">
        <div className="card">
          <h1>{currentPage}</h1>
          
          <div className="page-content">
            <div className="fun-runs-list">
              {FUN_RUNS.map((run, index) => (
                <div key={index} className="fun-run-item">
                  <span className="fun-run-date">{run.date}</span>
                  <button
                    className="fun-run-name-btn"
                    onClick={() => handleRunClick(run.website)}
                  >
                    {run.name}
                  </button>
                </div>
              ))}
            </div>
            
            <button
              className="back-btn"
              onClick={handleBackToMain}
            >
              Back to Main
            </button>
          </div>

          <div className="network-status">
            <span className="network-label">Network:</span>
            <span className={`network-value ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Render other placeholder pages
  if (currentPage) {
    return (
      <div className="app">
        <div className="card">
          <h1>{currentPage}</h1>
          
          <div className="page-content">
            <button
              className="back-btn"
              onClick={handleBackToMain}
            >
              Back to Main
            </button>
          </div>

          <div className="network-status">
            <span className="network-label">Network:</span>
            <span className={`network-value ${isOnline ? 'online' : 'offline'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>
    )
  }

  // Render main menu
  return (
    <div className="app">
      <div className="card">
        <h1>
          Keep on <em>Running</em>
        </h1>

        <div className="menu-container">
          <button
            className="menu-item"
            onClick={() => handleMenuClick('Running Schedule')}
          >
            Running Schedule
          </button>
          <button
            className="menu-item"
            onClick={() => handleMenuClick('Events')}
          >
            Upcoming Events
          </button>
          <button
            className="menu-item"
            onClick={() => handleMenuClick('Nutrition')}
          >
            Nutrition
          </button>
        </div>

        <div className="network-status">
          <span className="network-label">Network:</span>
          <span className={`network-value ${isOnline ? 'online' : 'offline'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
    </div>
  )
}

export default App
