'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoadingScreen.module.css'

const LINES = [
  { text: 'SHHHH...', style: 'accent' },
  { text: 'THE MONSTERS ARE COMING.', style: 'main' },
  { text: 'DO NOT MAKE A SOUND.', style: 'sub' },
]

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('purestatic')
  const [typedLines, setTypedLines] = useState(['', '', ''])
  const [recTime, setRecTime] = useState(0)
  const [showContent, setShowContent] = useState(false)
  const audioRef = useRef(null)
  const hasPlayed = useRef(false)

  const tryPlayAudio = () => {
    if (!audioRef.current || hasPlayed.current) return
    hasPlayed.current = true
    audioRef.current.volume = 0.38
    audioRef.current.currentTime = 0
    audioRef.current.play().catch(() => {})
  }

  useEffect(() => {
    const unlock = () => tryPlayAudio()
    window.addEventListener('click', unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })
    window.addEventListener('keydown', unlock, { once: true })
    setTimeout(() => tryPlayAudio(), 120)

    return () => {
      window.removeEventListener('click', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [])

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('sb-loaded')
    const repeat = !!alreadyLoaded

    // Timing — generous first load, comfortable repeat
    const pureStaticMs   = repeat ? 400  : 900
    const imageInMs      = repeat ? 500  : 900
    const imageShrinkMs  = repeat ? 300  : 500
    const contentDelayMs = repeat ? 100  : 200

    // Total before progress starts
    const progressStartMs = pureStaticMs + imageInMs + imageShrinkMs + contentDelayMs

    // Typing durations per line
    const lineDurations = repeat
      ? [200, 320, 260]
      : [420, 680, 560]

    const t1 = setTimeout(() => setStage('imagein'),  pureStaticMs)
    const t2 = setTimeout(() => setStage('shrink'),   pureStaticMs + imageInMs)
    const t3 = setTimeout(() => setShowContent(true), pureStaticMs + imageInMs + imageShrinkMs)

    // Typing — line by line
    let typeTimeouts = []
    let typeIntervals = []
    let elapsed = 0

    LINES.forEach((line, idx) => {
      const lineStart = elapsed
      const charDelay = lineDurations[idx] / line.text.length
      elapsed += lineDurations[idx] + 120

      const t = setTimeout(() => {
        let i = 0
        const iv = setInterval(() => {
          i++
          setTypedLines(prev => {
            const next = [...prev]
            next[idx] = line.text.slice(0, i)
            return next
          })
          if (i >= line.text.length) clearInterval(iv)
        }, charDelay)
        typeIntervals.push(iv)
      }, progressStartMs + lineStart)

      typeTimeouts.push(t)
    })

    // Progress bar — starts with content, finishes after all text
    const totalProgressMs = repeat ? 1200 : 2200
    const tickMs = 55
    let prog = 0
    let progInterval

    const progressTimeout = setTimeout(() => {
      const ticks = totalProgressMs / tickMs
      progInterval = setInterval(() => {
        prog += (100 / ticks) * (0.65 + Math.random() * 0.7)
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
            }, repeat ? 450 : 650)
          }, 200)
        }
        setProgress(Math.min(prog, 100))
      }, tickMs)
    }, progressStartMs)

    // REC timer
    const recInterval = setInterval(() => setRecTime(t => t + 1), 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(progressTimeout)
      typeTimeouts.forEach(clearTimeout)
      typeIntervals.forEach(clearInterval)
      clearInterval(progInterval)
      clearInterval(recInterval)
    }
  }, [])

  const formatTime = s => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className={styles.wrapper}
          exit={{ y: '-100%' }}
          transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
          onClick={tryPlayAudio}
        >
          {/* Audio */}
          <audio
            ref={audioRef}
            src="/audio/tv-static.wav"
            loop
            preload="auto"
          />

          {/* ── TOP BAR ── */}
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

          {/* ── STATIC LAYERS ── */}
          <div className={`${styles.static1} ${
            stage !== 'purestatic' ? styles.staticDim : ''
          } ${showContent ? styles.staticFaint : ''}`} />

          <div className={`${styles.static2} ${
            stage !== 'purestatic' ? styles.staticDim : ''
          } ${showContent ? styles.staticFaint : ''}`} />

          <div className={styles.rollLines} />

          {/* ── VIGNETTE + CRT ── */}
          <div className={styles.vignette} />
          <div className={styles.crtLines} />

          {/* ── GLITCH BARS ── */}
          {stage === 'purestatic' && (
            <>
              <div className={styles.glitchBar1} />
              <div className={styles.glitchBar2} />
              <div className={styles.glitchBar3} />
            </>
          )}

          {/* ── MAIN LAYOUT ── */}
          <div className={styles.mainLayout}>

            {/* Figure image — upper portion */}
            <div className={styles.imageSlot}>
              <div className={`${styles.figure} ${
                stage === 'imagein' || stage === 'shrink' || stage === 'done'
                  ? styles.figureVisible : ''
              }`} />
            </div>

            {/* Text + progress — lower portion */}
            <div className={styles.contentSlot}>
              <AnimatePresence>
                {showContent && (
                  <motion.div
                    className={styles.contentInner}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  >
                    {/* Typed lines */}
                    <div className={styles.typedBlock}>
                      {LINES.map((line, i) => (
                        <p
                          key={i}
                          className={`${styles.typedLine} ${styles[`line_${line.style}`]}`}
                        >
                          {typedLines[i]}
                          {typedLines[i].length > 0 &&
                            typedLines[i].length < line.text.length && (
                              <span className={styles.cursor}>▌</span>
                            )}
                          {i === LINES.length - 1 &&
                            typedLines[i].length === line.text.length &&
                            stage !== 'done' && (
                              <span className={styles.cursor}>▌</span>
                            )}
                        </p>
                      ))}
                    </div>

                    {/* Divider */}
                    <div className={styles.divider} />

                    {/* Progress */}
                    <div className={styles.barWrapper}>
                      <div className={styles.barTrack}>
                        <motion.div
                          className={styles.barFill}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.12 }}
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

                    <p className={styles.statusText}>
                      {progress < 35 && '> entering the room...'}
                      {progress >= 35 && progress < 70 && '> do not make a sound...'}
                      {progress >= 70 && progress < 100 && "> it's already here."}
                      {progress >= 100 && '> system ready.'}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── CORNERS ── */}
          <div className={`${styles.corner} ${styles.cornerTL}`} />
          <div className={`${styles.corner} ${styles.cornerTR}`} />
          <div className={`${styles.corner} ${styles.cornerBL}`} />
          <div className={`${styles.corner} ${styles.cornerBR}`} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}