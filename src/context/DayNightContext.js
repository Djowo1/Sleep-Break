'use client'

import { createContext, useContext, useState, useEffect } from 'react'

export const DayNightContext = createContext()

export function DayNightProvider({ children }) {
  const [isDayMode, setIsDayMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('sleepbreak-daymode')
    if (saved === 'true') {
      setIsDayMode(true)
      document.body.classList.add('day-mode')
    }
  }, [])

  const toggleDayNight = () => {
    setIsDayMode(prev => {
      const next = !prev
      if (next) {
        document.body.classList.add('day-mode')
        localStorage.setItem('sleepbreak-daymode', 'true')
      } else {
        document.body.classList.remove('day-mode')
        localStorage.setItem('sleepbreak-daymode', 'false')
      }
      return next
    })
  }

  return (
    <DayNightContext.Provider value={{ isDayMode, toggleDayNight }}>
      {children}
    </DayNightContext.Provider>
  )
}

export function useDayNight() {
  return useContext(DayNightContext)
}