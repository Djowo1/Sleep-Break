'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoadingScreen.module.css'

const LINES = [
  'SHHHH...',
  'THE MONSTERS ARE COMING.',
  'DO NOT MAKE A SOUND.',
]

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('purestatic')
  const [typedLines, setTypedLines] = useState(['', '', ''])
  const [recTime, setRecTime] = useState(0)
  const audioRef = useRef(null)
  const hasInteracted = useRef(false)

  // Try to play audio — handles autoplay policy
  const tryPlayAudio = () => {
    if (!audioRef.current || hasInteracted.current) return
    hasInteracted.current = true
    audioRef.current.volume = 0.4
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  useEffect(() => {
    // Listen for any user interaction to unlock audio
    const unlock = () => tryPlayAudio()
    window.addEventListener('click', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })

    // Try immediately (works on some browsers)
    setTimeout(() => tryPlayAudio(), 100)

    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('sb-loaded')
    const repeat = !!alreadyLoaded

    const pureStaticMs = repeat ? 250 : 500
    const imageInMs = repeat ? 300 : 600
    const shrinkMs = repeat ? 200 : 350

    const t1 = setTimeout(() => setStage('imagein'), pureStaticMs)
    const t2 = setTimeout(() => setStage('shrink'), pureStaticMs + imageInMs)

    // Typing effect — 3 lines, each types after the previous
    const typingStart = pureStaticMs + imageInMs + shrinkMs
    const lineDurations = repeat
      ? [160, 220, 200]
      : [280, 380, 320]

    let timeouts = []
    let intervals = []
    let elapsed = 0

    LINES.forEach((line, lineIdx) => {
      const start = elapsed
      const charDelay = lineDurations[lineIdx] / line.length
      elapsed += lineDurations[lineIdx] + 80 // 80ms gap between lines

      const t = setTimeout(() => {
        let i = 0
        const iv = setInterval(() => {
          i++
          setTypedLines(prev => {
            const next = [...prev]
            next[lineIdx] = line.slice(0, i)
            return next
          })
          if (i >= line.length) clearInterval(iv)
        }, charDelay)
        intervals.push(iv)
      }, typingStart + start)

      timeouts.push(t)
    })

    // Progress bar — runs parallel with typing
    let prog = 0
    let progInterval
    const progressTimeout = setTimeout(() => {
      const totalMs = repeat ? 900 : 1400
      const tickMs = 50
      const ticks = totalMs / tickMs

      progInterval = setInterval(() => {
        prog += (100 / ticks) * (0.7 + Math.random() * 0.6)
        if (prog >= 100) {
          prog = 100
          clearInterval(progInterval)
          setTimeout(() => {
            setStage('done')
            setTimeout(() => {
              setIsLoading(false)
              sessionStorage.setItem('sb-loaded', 'true')
              if (audioRef.current) {
                audioRef.current.pause()
                audioRef.current.currentTime = 0
              }
            }, repeat ? 350 : 500)
          }, 200)
        }
        setProgress(Math.min(prog, 100))
      }, tickMs)
    }, typingStart)

    // REC timer
    const recInterval = setInterval(() => {
      setRecTime(t => t + 1)
    }, 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(progressTimeout)
      timeouts.forEach(clearTimeout)
      intervals.forEach(clearInterval)
      clearInterval(progInterval)
      clearInterval(recInterval)
    }
  }, [])

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const showContent = stage === 'shrink' || stage === 'done'

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.wrapper}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
          onClick={tryPlayAudio}
        >
          {/* Audio */}
          <audio
            ref={audioRef}
            src="/audio/tv-static.wav"
            loop
            preload="auto"
          />

          {/* TOP BAR — DO NOT TURN OFF + timer */}
          <div className={styles.topBar}>
            <div className={styles.recBadge}>
              <span className={styles.recDot} />
              <span className={styles.recLabel}>DO NOT TURN OFF</span>
            </div>
            <div className={styles.rightBadge}>
              <span className={styles.channelLabel}>CH 07</span>
              <span className={styles.recTimer}>{formatTime(recTime)}</span>
            </div>
          </div>

          {/* Static noise — layered for more realism */}
          <div
            className={`${styles.static} ${
              stage !== 'purestatic' ? styles.staticDim : ''
            } ${showContent ? styles.staticFaint : ''}`}
          />
          <div
            className={`${styles.staticLayer2} ${
              stage !== 'purestatic' ? styles.staticDim : ''
            } ${showContent ? styles.staticFaint : ''}`}
          />

          {/* Horizontal roll lines — makes it look more like real TV static */}
          <div className={styles.rollLines} />

          {/* Vignette */}
          <div className={styles.vignette} />

          {/* CRT lines */}
          <div className={styles.crtLines} />

          {/* Glitch bars — only pure static */}
          {stage === 'purestatic' && (
            <>
              <div className={styles.glitchBar1} />
              <div className={styles.glitchBar2} />
              <div className={styles.glitchBar3} />
            </>
          )}

          {/* Main scene — image + content */}
          <div className={styles.scene}>

            {/* Figure image */}
            <div
              className={`${styles.bgFigure} ${
                stage === 'imagein' ? styles.bgFigureIn : ''
              } ${showContent ? styles.bgFigureShrink : ''}`}
            />

            {/* Text + progress — appears below shrunk image */}
            <AnimatePresence>
              {showContent && (
                <motion.div
                  className={styles.bottomContent}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                >
                  {/* Typed lines */}
                  <div className={styles.typedBlock}>
                    {LINES.map((_, i) => (
                      <p
                        key={i}
                        className={`${styles.typedLine} ${
                          i === 0 ? styles.typedLineAccent : ''
                        } ${i === 2 ? styles.typedLineSub : ''}`}
                      >
                        {typedLines[i]}
                        {/* Show cursor only on the actively typing line */}
                        {typedLines[i].length > 0 &&
                          typedLines[i].length < LINES[i].length && (
                            <span className={styles.cursor}>▌</span>
                          )}
                        {/* Show cursor on last line until done */}
                        {i === LINES.length - 1 &&
                          typedLines[i].length === LINES[i].length &&
                          stage !== 'done' && (
                            <span className={styles.cursor}>▌</span>
                          )}
                      </p>
                    ))}
                  </div>

                  {/* Divider */}
                  <div className={styles.divider} />

                  {/* Progress bar */}
                  <div className={styles.barWrapper}>
                    <div className={styles.barTrack}>
                      <motion.div
                        className={styles.barFill}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.1 }}
                      />
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={i}
                          className={styles.segment}
                          style={{ left: `${(i + 1) * 10}%` }}
                        />
                      ))}
                    </div>
                    <span className={styles.percent}>
                      {Math.round(progress)}%
                    </span>
                  </div>

                  <p className={styles.loadingStatus}>
                    {progress < 40 && '> entering the room...'}
                    {progress >= 40 && progress < 80 && '> do not make a sound...'}
                    {progress >= 80 && progress < 100 && '> it\'s already here.'}
                    {progress >= 100 && '> system ready.'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Corner decorations */}
          <div className={`${styles.corner} ${styles.cornerTL}`} />
          <div className={`${styles.corner} ${styles.cornerTR}`} />
          <div className={`${styles.corner} ${styles.cornerBL}`} />
          <div className={`${styles.corner} ${styles.cornerBR}`} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}