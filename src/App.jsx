import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'

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

// Week training data - grouped by week starting Monday
const WEEK_TRAINING_DATA = {
  'Feb 23': {
    monday: 'Monday 23 Feb 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 24 Feb 2026 - Gym Strength 1',
    wednesday: 'Wednesday 25 Feb 2026 - Intervals: 6×400m @ 4:55/km\nRecovery: 90 sec easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 26 Feb 2026 - Gym Strength 2',
    friday: 'Friday 27 Feb 2026 - Tempo: 3km @ 5:25/km (HR 165–175)',
    saturday: 'Saturday 28 Feb 2026 - Long Run: 9km easy (HR cap 150)',
    sunday: 'Sunday 01 Mar 2026 - RACE: River Run Geelong 5km (HR 165–175 controlled)',
    notes: ''
  },
  'Mar 2': {
    monday: 'Monday 02 Mar 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 03 Mar 2026 - Gym Strength 1',
    wednesday: 'Wednesday 04 Mar 2026 - RACE: Sunset Series – The Tan 3.8km (HR 165–175 controlled)',
    thursday: 'Thursday 05 Mar 2026 - Gym Strength 2',
    friday: 'Friday 06 Mar 2026 - Tempo: 3km @ 5:25/km (HR 165–175)',
    saturday: 'Saturday 07 Mar 2026 - Long Run: 10km easy (HR cap 150)',
    sunday: 'Sunday 08 Mar 2026 - Gym Recovery',
    notes: ''
  },
  'Mar 9': {
    monday: 'Monday 09 Mar 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 10 Mar 2026 - Gym Strength 1',
    wednesday: 'Wednesday 11 Mar 2026 - Intervals: 5×800m @ 5:00/km\nRecovery: 2 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 12 Mar 2026 - Gym Strength 2',
    friday: 'Friday 13 Mar 2026 - Tempo: 4km @ 5:20/km (HR 165–175)',
    saturday: 'Saturday 14 Mar 2026 - Long Run: 10km easy (HR cap 150)',
    sunday: 'Sunday 15 Mar 2026 - Gym Recovery',
    notes: ''
  },
  'Mar 16': {
    monday: 'Monday 16 Mar 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 17 Mar 2026 - Gym Strength 1',
    wednesday: 'Wednesday 18 Mar 2026 - Intervals: 6×800m @ 5:00/km\nRecovery: 2 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 19 Mar 2026 - Gym Strength 2',
    friday: 'Friday 20 Mar 2026 - Tempo: 4km @ 5:20/km (HR 165–175)',
    saturday: 'Saturday 21 Mar 2026 - Long Run: 11km easy (HR cap 150)',
    sunday: 'Sunday 22 Mar 2026 - Gym Recovery',
    notes: ''
  },
  'Mar 23': {
    monday: 'Monday 23 Mar 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 24 Mar 2026 - Gym Strength 1',
    wednesday: 'Wednesday 25 Mar 2026 - Intervals: 4×1km @ 5:05/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 26 Mar 2026 - Gym Strength 2',
    friday: 'Friday 27 Mar 2026 - Tempo: 3km light (HR 165–175)',
    saturday: 'Saturday 28 Mar 2026 - Gym Recovery',
    sunday: 'Sunday 29 Mar 2026 - RACE: Run For The Kids 5km (HR 165–175 controlled)',
    notes: ''
  },
  'Mar 30': {
    monday: 'Monday 30 Mar 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 31 Mar 2026 - Gym Strength 1',
    wednesday: 'Wednesday 01 Apr 2026 - Intervals: 5×1km @ 5:00/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 02 Apr 2026 - Gym Strength 2',
    friday: 'Friday 03 Apr 2026 - Tempo: 4km @ 5:15/km (HR 165–175)',
    saturday: 'Saturday 04 Apr 2026 - Long Run: 11km easy (HR cap 150)',
    sunday: 'Sunday 05 Apr 2026 - Gym Recovery',
    notes: ''
  },
  'Apr 6': {
    monday: 'Monday 06 Apr 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 07 Apr 2026 - Gym Strength 1',
    wednesday: 'Wednesday 08 Apr 2026 - Intervals: 4×400m @ 4:50/km\nRecovery: 90 sec easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 09 Apr 2026 - Gym Strength 2',
    friday: 'Friday 10 Apr 2026 - Tempo: 20 min jog (HR 165–175)',
    saturday: 'Saturday 11 Apr 2026 - Gym Recovery',
    sunday: 'Sunday 12 Apr 2026 - RACE: Gumbaya World 5km (TEST – full effort)',
    notes: ''
  },
  'Apr 13': {
    monday: 'Monday 13 Apr 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 14 Apr 2026 - Gym Strength 1',
    wednesday: 'Wednesday 15 Apr 2026 - Intervals: 6×1km @ 4:55/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 16 Apr 2026 - Gym Strength 2',
    friday: 'Friday 17 Apr 2026 - Tempo: 4km @ 5:15/km (HR 165–175)',
    saturday: 'Saturday 18 Apr 2026 - Long Run: 12km easy (HR cap 150)',
    sunday: 'Sunday 19 Apr 2026 - Gym Recovery',
    notes: ''
  },
  'Apr 20': {
    monday: 'Monday 20 Apr 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 21 Apr 2026 - Gym Strength 1',
    wednesday: 'Wednesday 22 Apr 2026 - Intervals: 4×1200m @ 5:00/km\nRecovery: 2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 23 Apr 2026 - Gym Strength 2',
    friday: 'Friday 24 Apr 2026 - Tempo: 5km @ 5:15/km (HR 165–175)',
    saturday: 'Saturday 25 Apr 2026 - Gym Recovery',
    sunday: 'Sunday 26 Apr 2026 - RACE: Run The Tan 3.8km (HR 165–175 controlled)',
    notes: ''
  },
  'Apr 27': {
    monday: 'Monday 27 Apr 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 28 Apr 2026 - Gym Strength 1',
    wednesday: 'Wednesday 29 Apr 2026 - Intervals: 5×1km @ 4:55/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 30 Apr 2026 - Gym Strength 2',
    friday: 'Friday 01 May 2026 - Tempo: 5km @ 5:10/km (HR 165–175)',
    saturday: 'Saturday 02 May 2026 - Long Run: 13km easy (HR cap 150)',
    sunday: 'Sunday 03 May 2026 - Gym Recovery',
    notes: ''
  },
  'May 4': {
    monday: 'Monday 04 May 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 05 May 2026 - Gym Strength 1',
    wednesday: 'Wednesday 06 May 2026 - Intervals: 3×1600m @ 5:05/km\nRecovery: 3 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 07 May 2026 - Gym Strength 2',
    friday: 'Friday 08 May 2026 - Tempo: 4km steady (HR 165–175)',
    saturday: 'Saturday 09 May 2026 - Gym Recovery',
    sunday: 'Sunday 10 May 2026 - RACE: Mother\'s Day Classic 4km (HR 165–175 controlled)',
    notes: ''
  },
  'May 11': {
    monday: 'Monday 11 May 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 12 May 2026 - Gym Strength 1',
    wednesday: 'Wednesday 13 May 2026 - Intervals: 6×800m @ 4:50/km\nRecovery: 2 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 14 May 2026 - Gym Strength 2',
    friday: 'Friday 15 May 2026 - Tempo: 4km @ 5:10/km (HR 165–175)',
    saturday: 'Saturday 16 May 2026 - Gym Recovery',
    sunday: 'Sunday 17 May 2026 - RACE: Memory Run 10km (HR 160–170 steady build)',
    notes: ''
  },
  'May 18': {
    monday: 'Monday 18 May 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 19 May 2026 - Gym Strength 1',
    wednesday: 'Wednesday 20 May 2026 - Intervals: 5×1km @ 4:55/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 21 May 2026 - Gym Strength 2',
    friday: 'Friday 22 May 2026 - Tempo: 5km @ 5:10/km (HR 165–175)',
    saturday: 'Saturday 23 May 2026 - Long Run: 14km easy (HR cap 150)',
    sunday: 'Sunday 24 May 2026 - Gym Recovery',
    notes: ''
  },
  'May 25': {
    monday: 'Monday 25 May 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 26 May 2026 - Gym Strength 1',
    wednesday: 'Wednesday 27 May 2026 - Intervals: 4×1600m @ 5:00/km\nRecovery: 3 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 28 May 2026 - Gym Strength 2',
    friday: 'Friday 29 May 2026 - Tempo: 5km @ 5:10/km (HR 165–175)',
    saturday: 'Saturday 30 May 2026 - Long Run: 14km easy (HR cap 150)',
    sunday: 'Sunday 31 May 2026 - Gym Recovery',
    notes: ''
  },
  'June 1': {
    monday: 'Monday 01 Jun 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 02 Jun 2026 - Gym Strength 1',
    wednesday: 'Wednesday 03 Jun 2026 - Intervals: 6×1km @ 4:55/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 04 Jun 2026 - Gym Strength 2',
    friday: 'Friday 05 Jun 2026 - Tempo: 5km @ 5:05/km (HR 165–175)',
    saturday: 'Saturday 06 Jun 2026 - Long Run: 13km easy (HR cap 150)',
    sunday: 'Sunday 07 Jun 2026 - Gym Recovery',
    notes: ''
  },
  'June 8': {
    monday: 'Monday 08 Jun 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 09 Jun 2026 - Gym Strength 1',
    wednesday: 'Wednesday 10 Jun 2026 - Intervals: 6×800m @ 4:45–4:50/km\nRecovery: 2 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 11 Jun 2026 - Gym Strength 2',
    friday: 'Friday 12 Jun 2026 - Tempo: 4km @ 5:05/km (HR 165–175)',
    saturday: 'Saturday 13 Jun 2026 - Long Run: 14km easy (HR cap 150)',
    sunday: 'Sunday 14 Jun 2026 - Gym Recovery',
    notes: ''
  },
  'June 15': {
    monday: 'Monday 15 Jun 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 16 Jun 2026 - Gym Strength 1',
    wednesday: 'Wednesday 17 Jun 2026 - Intervals: 5×1km @ 4:55/km\nRecovery: 2–2:30 easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 18 Jun 2026 - Gym Strength 2',
    friday: 'Friday 19 Jun 2026 - Tempo: 5km @ 5:05/km (HR 165–175)',
    saturday: 'Saturday 20 Jun 2026 - Long Run: 13km easy (HR cap 150)',
    sunday: 'Sunday 21 Jun 2026 - Gym Recovery',
    notes: ''
  },
  'June 22': {
    monday: 'Monday 22 Jun 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 23 Jun 2026 - Gym Strength 1',
    wednesday: 'Wednesday 24 Jun 2026 - Intervals: 3×2km @ 5:05/km\nRecovery: 3 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 25 Jun 2026 - Gym Strength 2',
    friday: 'Friday 26 Jun 2026 - Tempo: 4km steady (HR 165–175)',
    saturday: 'Saturday 27 Jun 2026 - Long Run: 12km easy (HR cap 150)',
    sunday: 'Sunday 28 Jun 2026 - Gym Recovery',
    notes: ''
  },
  'June 29': {
    monday: 'Monday 29 Jun 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 30 Jun 2026 - Gym Strength 1',
    wednesday: 'Wednesday 01 Jul 2026 - Intervals: 6×800m @ 4:50/km\nRecovery: 2 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 02 Jul 2026 - Gym Strength 2',
    friday: 'Friday 03 Jul 2026 - Tempo: 4km @ 5:05/km (HR 165–175)',
    saturday: 'Saturday 04 Jul 2026 - Long Run: 12km easy (HR cap 150)',
    sunday: 'Sunday 05 Jul 2026 - Gym Recovery',
    notes: ''
  },
  'July 6': {
    monday: 'Monday 06 Jul 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 07 Jul 2026 - Gym Strength 1',
    wednesday: 'Wednesday 08 Jul 2026 - Intervals: 4×1km @ 4:55/km\nRecovery: 2 min easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 09 Jul 2026 - Gym Strength 2',
    friday: 'Friday 10 Jul 2026 - Tempo: 3km @ 5:05/km (HR 165–175)',
    saturday: 'Saturday 11 Jul 2026 - Long Run: 10km easy (HR cap 150)',
    sunday: 'Sunday 12 Jul 2026 - Gym Recovery',
    notes: ''
  },
  'July 13': {
    monday: 'Monday 13 Jul 2026 - Easy 35–40 min @ 6:20–6:45 (HR cap 145)',
    tuesday: 'Tuesday 14 Jul 2026 - Gym Strength 1',
    wednesday: 'Wednesday 15 Jul 2026 - Intervals: 4×400m @ 4:45/km\nRecovery: 90 sec easy jog recovery (HR drops to ~140–150 before next rep)',
    thursday: 'Thursday 16 Jul 2026 - Gym Strength 2',
    friday: 'Friday 17 Jul 2026 - Tempo: 20 min jog (HR 165–175)',
    saturday: 'Saturday 18 Jul 2026 - Gym Recovery',
    sunday: 'Sunday 19 Jul 2026 - RACE: Run Melbourne 5.5km (GOAL – full effort)',
    notes: ''
  }
}

// Function to generate week ranges starting from Mon 23rd Feb 2026
const generateWeeks = () => {
  const weeks = []
  
  // Start date: Monday, February 23rd, 2026 (matches training data year)
  let startDate = new Date(2026, 1, 23) // Month is 0-indexed, so 1 = February
  
  // Ensure it's a Monday (day 1)
  const dayOfWeek = startDate.getDay()
  if (dayOfWeek !== 1) {
    // Adjust to the Monday of that week
    const diff = (1 - dayOfWeek + 7) % 7
    startDate.setDate(startDate.getDate() + diff)
  }
  
  // Generate weeks up to July 19th, 2026 (Run Melbourne race day)
  // Use 2026 since that's the year in the training data
  const endDate = new Date(2026, 6, 19) // July 19th, 2026 (month 6 = July)
  
  let currentWeekStart = new Date(startDate)
  
  while (currentWeekStart <= endDate) {
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
  const [dbLoadTime, setDbLoadTime] = useState(null)
  const [dbSaveTime, setDbSaveTime] = useState(null)
  const [dbError, setDbError] = useState(null)

  // Initialize device label and check for target page after refresh
  useEffect(() => {
    const stored = localStorage.getItem('deviceLabel')
    if (stored) {
      setDeviceLabel(stored)
    } else {
      setShowLabelPrompt(true)
    }

    // Check if we should navigate to a page after refresh
    const targetPage = localStorage.getItem('targetPage')
    if (targetPage) {
      localStorage.removeItem('targetPage')
      setCurrentPage(targetPage)
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
    // Store target page in localStorage, then refresh
    localStorage.setItem('targetPage', menuItem)
    window.location.reload()
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

  // Load checked days from Supabase when week is selected
  useEffect(() => {
    if (selectedWeek && currentPage === 'Running Schedule') {
      loadCheckboxStates(selectedWeek)
    } else if (!selectedWeek) {
      setCheckedDays({})
      setDbLoadTime(null)
      setDbError(null)
    }
  }, [selectedWeek, currentPage])

  const loadCheckboxStates = async (weekKey) => {
    setDbError(null)
    if (!isOnline) {
      setDbError('Offline - cannot load')
      return
    }

    try {
      const { data, error } = await supabase
        .from('app_state')
        .select('training_status, updated_at')
        .eq('id', 1)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // Row doesn't exist, create it
          const { data: newData, error: insertError } = await supabase
            .from('app_state')
            .insert({
              id: 1,
              training_status: '{}',
              updated_by: deviceLabel || 'unknown',
              updated_at: new Date().toISOString()
            })
            .select('training_status, updated_at')
            .single()

          if (insertError) {
            setDbError(`DB Error: ${insertError.message}`)
            return
          }
          setCheckedDays({})
          setDbLoadTime(newData.updated_at)
          return
        }
        setDbError(`Load Error: ${error.message}`)
        return
      }

      // Parse JSON from training_status
      let checkboxData = {}
      try {
        const status = data.training_status || '{}'
        checkboxData = typeof status === 'string' ? JSON.parse(status) : status
      } catch (e) {
        checkboxData = {}
      }

      const weekState = checkboxData[weekKey] || {}
      setCheckedDays(weekState)
      setDbLoadTime(data.updated_at)
    } catch (err) {
      setDbError(`Error: ${err.message}`)
      console.error('Load error:', err)
    }
  }

  const saveCheckboxState = async (weekKey, dayKey, checked) => {
    // Update UI immediately - don't revert on error
    setCheckedDays(prev => ({
      ...prev,
      [dayKey]: checked
    }))

    if (!isOnline) {
      setDbError('Offline - changes not saved')
      return
    }

    setDbError(null)
    try {
      // Get current state
      const { data: current, error: fetchErr } = await supabase
        .from('app_state')
        .select('training_status')
        .eq('id', 1)
        .single()

      if (fetchErr && fetchErr.code !== 'PGRST116') {
        setDbError(`Fetch Error: ${fetchErr.message}`)
        return
      }

      // Parse existing data
      let checkboxData = {}
      try {
        const status = current?.training_status || '{}'
        checkboxData = typeof status === 'string' ? JSON.parse(status) : status
      } catch (e) {
        checkboxData = {}
      }

      // Update this week's checkbox
      if (!checkboxData[weekKey]) {
        checkboxData[weekKey] = {}
      }
      checkboxData[weekKey][dayKey] = checked

      // Save to DB
      const { data: saved, error: saveErr } = await supabase
        .from('app_state')
        .upsert({
          id: 1,
          training_status: JSON.stringify(checkboxData),
          updated_by: deviceLabel || 'unknown',
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'id'
        })
        .select('updated_at')
        .single()

      if (saveErr) {
        setDbError(`Save Error: ${saveErr.message}`)
        return
      }

      setDbSaveTime(saved.updated_at)
      
      // Re-fetch to sync with other devices
      const { data: confirm } = await supabase
        .from('app_state')
        .select('training_status, updated_at')
        .eq('id', 1)
        .single()

      if (confirm) {
        try {
          const status = confirm.training_status || '{}'
          const confirmedData = typeof status === 'string' ? JSON.parse(status) : status
          const confirmedWeek = confirmedData[weekKey] || {}
          setCheckedDays(confirmedWeek)
          setDbLoadTime(confirm.updated_at)
        } catch (e) {
          // Keep current state
        }
      }
    } catch (err) {
      setDbError(`Error: ${err.message}`)
      console.error('Save error:', err)
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
          const newValue = !checkedDays[dayKey]
          saveCheckboxState(selectedWeek, dayKey, newValue)
        }
        
        // Parse day detail to extract heading and workout info
        const parseDayDetail = (detail) => {
          const parts = detail.split(' - ')
          if (parts.length >= 2) {
            return {
              heading: parts[0], // "Monday 23 Feb 2026"
              workout: parts.slice(1).join(' - ') // Rest of the detail
            }
          }
          return {
            heading: detail,
            workout: ''
          }
        }
        
        // Get color class for day
        const getDayColorClass = (dayName, detail) => {
          const detailLower = detail.toLowerCase()
          if (dayName === 'Monday' || dayName === 'Wednesday' || dayName === 'Friday') {
            return 'day-green'
          }
          if (dayName === 'Tuesday' || dayName === 'Thursday') {
            return 'day-orange'
          }
          if (dayName === 'Saturday') {
            if (detailLower.includes('long run')) {
              return 'day-green'
            }
            return 'day-orange'
          }
          if (dayName === 'Sunday') {
            if (detailLower.includes('race') || detailLower.includes('run')) {
              return 'day-green'
            }
            return 'day-orange'
          }
          return ''
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
                    const isChecked = checkedDays[day.key] === true
                    const parsed = parseDayDetail(day.detail)
                    const colorClass = getDayColorClass(day.name, day.detail)
                    
                    return (
                      <div key={index} className={`day-item ${colorClass}`}>
                        <input
                          type="checkbox"
                          className="day-checkbox"
                          checked={isChecked}
                          onChange={() => handleDayCheck(day.key)}
                        />
                        <div className="day-content">
                          <h3 className="day-heading">{parsed.heading}</h3>
                          <span className={`day-workout ${isChecked ? 'completed' : ''}`}>
                            {parsed.workout}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                  
                  {dbError && (
                    <div className="error-message" style={{ marginTop: '16px', whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '11px', maxHeight: '300px', overflow: 'auto' }}>
                      {dbError}
                    </div>
                  )}
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
