'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './LoadingScreen.module.css'

const FULL_TEXT = 'SHHHH... THE MONSTERS ARE COMING. be ready.'

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)
  const [stage, setStage] = useState('purestatic') // purestatic | imagein | shrink | done
  const [typedText, setTypedText] = useState('')
  const [recTime, setRecTime] = useState(0)
  const audioRef = useRef(null)

  useEffect(() => {
    const alreadyLoaded = sessionStorage.getItem('sb-loaded')
    const repeat = !!alreadyLoaded

    // Play static audio
    if (audioRef.current) {
      audioRef.current.volume = 0.35
      audioRef.current.currentTime = 0
      const playPromise = audioRef.current.play()
      if (playPromise) playPromise.catch(() => {})
    }

    // Total timing budget
    const pureStaticMs = repeat ? 250 : 450
    const imageInMs = repeat ? 350 : 550
    const shrinkMs = repeat ? 250 : 350
    // remaining time goes to typing + progress, running in parallel

    const t1 = setTimeout(() => setStage('imagein'), pureStaticMs)
    const t2 = setTimeout(() => setStage('shrink'), pureStaticMs + imageInMs)

    // Typing effect — starts right as shrink begins, runs in parallel with progress bar
    const typingStart = pureStaticMs + imageInMs
    const typingDuration = repeat ? 900 : 1400
    const charDelay = typingDuration / FULL_TEXT.length

    let typeInterval
    const typingTimeout = setTimeout(() => {
      let i = 0
      typeInterval = setInterval(() => {
        i++
        setTypedText(FULL_TEXT.slice(0, i))
        if (i >= FULL_TEXT.length) clearInterval(typeInterval)
      }, charDelay)
    }, typingStart)

    // Progress bar — runs in parallel with typing
    let prog = 0
    let progInterval
    const progressTimeout = setTimeout(() => {
      const totalProgressMs = repeat ? 1000 : 1600
      const tickMs = 60
      const ticks = totalProgressMs / tickMs
      const stepAvg = 100 / ticks

      progInterval = setInterval(() => {
        prog += stepAvg * (0.6 + Math.random() * 0.8)
        if (prog >= 100) {
          prog = 100
          clearInterval(progInterval)
          setTimeout(() => {
            setStage('done')
            setTimeout(() => {
              setIsLoading(false)
              sessionStorage.setItem('sb-loaded', 'true')
              if (audioRef.current) audioRef.current.pause()
            }, repeat ? 350 : 500)
          }, 150)
        }
        setProgress(Math.min(prog, 100))
      }, tickMs)
    }, typingStart)

    // REC timer ticking
    const recInterval = setInterval(() => {
      setRecTime(t => t + 1)
    }, 1000)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(typingTimeout)
      clearTimeout(progressTimeout)
      clearInterval(typeInterval)
      clearInterval(progInterval)
      clearInterval(recInterval)
    }
  }, [])

  const formatRecTime = (s) => {
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
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Static audio */}
          <audio ref={audioRef} src="/audio/tv-static.wav" loop preload="auto" />

          {/* REC indicator — visible throughout */}
          <div className={styles.recBadge}>
            <span className={styles.recDot} />
            <span className={styles.recLabel}>REC</span>
            <span className={styles.recTimer}>{formatRecTime(recTime)}</span>
          </div>

          {/* Channel number, top right — adds to "broadcast" feel */}
          <div className={styles.channelBadge}>CH. 07</div>

          {/* Background figure image */}
          <div
            className={`${styles.bgFigure} ${
              stage === 'imagein' ? styles.bgFigureIn : ''
            } ${
              stage === 'shrink' || stage === 'done' ? styles.bgFigureShrink : ''
            }`}
          />

          {/* Static noise layer — always present, fades as scene progresses */}
          <div
            className={`${styles.static} ${
              stage !== 'purestatic' ? styles.staticDim : ''
            } ${
              stage === 'shrink' || stage === 'done' ? styles.staticFaint : ''
            }`}
          />

          {/* Vignette */}
          <div className={styles.vignette} />

          {/* CRT lines */}
          <div className={styles.crtLines} />

          {/* Glitch bars — only during pure static */}
          {stage === 'purestatic' && (
            <>
              <div className={styles.glitchBar1} />
              <div className={styles.glitchBar2} />
              <div className={styles.glitchBar3} />
            </>
          )}

          {/* Text + Progress — appears below image once shrunk */}
          <AnimatePresence>
            {(stage === 'shrink' || stage === 'done') && (
              <motion.div
                className={styles.bottomContent}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              >
                <p className={styles.typedText}>
                  {typedText}
                  <span className={styles.cursor}>▌</span>
                </p>

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
              </motion.div>
            )}
          </AnimatePresence>

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