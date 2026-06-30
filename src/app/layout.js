'use client'
import { DayNightProvider } from '../context/DayNightContext'
import '../styles/globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <DayNightProvider>
        <body>
          <div className="scanline-overlay" />
          {children}
        </body>
      </DayNightProvider>
    </html>
  )
}