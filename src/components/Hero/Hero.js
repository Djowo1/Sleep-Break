'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import styles from './Hero.module.css'
import { FaDiscord, FaSteam } from 'react-icons/fa'

const DEMO_DATE = new Date('2026-07-31T00:00:00')

function useCountdown(target) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0, hours: 0, minutes: 0, seconds: 0
  })

  useEffect(() => {
    const calc = () => {
      const diff = target - Date.now()
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        return
      }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [target])

  return timeLeft
}

function Particles() {
  const particles = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    size: `${Math.random() * 4 + 2}px`,
    duration: `${Math.random() * 12 + 8}s`,
    delay: `${Math.random() * 8}s`,
    opacity: Math.random() * 0.6 + 0.2,
  }))

  return (
    <div className={styles.particles} aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className={styles.particle}
          style={{
            left: p.left,
            width: p.size,
            height: p.size,
            animationDuration: p.duration,
            animationDelay: p.delay,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  )
}

function CandleGlow({ style }) {
  return (
    <div className={styles.candleGlow} style={style} aria-hidden="true" />
  )
}

export default function Hero() {
  const heroRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timeLeft = useCountdown(DEMO_DATE)

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })

  // Parallax transforms — disabled on mobile
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const midY = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const fgY = useTransform(scrollYProgress, [0, 1], ['0%', '8%'])

  // Crawl teaser — grows as user scrolls
  const crawlOpacity = useTransform(scrollYProgress, [0, 0.6], [0.08, 0.75])
  const crawlScale = useTransform(scrollYProgress, [0, 0.6], [0.85, 1.1])

  // Content fades out as user scrolls
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const contentY = useTransform(scrollYProgress, [0, 0.4], ['0%', '-12%'])

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handlePlayDemo = () => {
    const el = document.getElementById('demo')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleDiscord = () => {
    window.open('https://discord.gg/sleepbreak', '_blank')
  }

  const pad = n => String(n).padStart(2, '0')

  return (
    <section
      id="home"
      ref={heroRef}
      className={styles.hero}
    >
      {/* ── BACKGROUND LAYERS ── */}
      <div className={styles.bgWrapper} aria-hidden="true">
        {/* Layer 1 — deepest background */}
        <motion.div
          className={styles.bgLayer1}
          style={{ y: isMobile ? 0 : bgY }}
        >
          <div
            className={styles.bgImage}
            style={{
              backgroundImage: `url('/images/hero/horror-bedroom.png')`
            }}
          />
        </motion.div>

        {/* Layer 2 — mid layer dark overlay */}
        <motion.div
          className={styles.bgLayer2}
          style={{ y: isMobile ? 0 : midY }}
        >
          <div className={styles.midOverlay} />
        </motion.div>

        {/* Layer 3 — foreground vignette */}
        <motion.div
          className={styles.bgLayer3}
          style={{ y: isMobile ? 0 : fgY }}
        >
          <div className={styles.vignette} />
        </motion.div>

        {/* THE CRAWL TEASER — behind TV */}
        <motion.div
          className={styles.crawlTeaser}
          style={{
            opacity: crawlOpacity,
            scale: crawlScale,
          }}
        >
          <div className={styles.crawlShape} />
        </motion.div>

        {/* Candle glows */}
        <CandleGlow style={{ bottom: '22%', left: '30%', animationDelay: '0s' }} />
        <CandleGlow style={{ bottom: '22%', left: '35%', animationDelay: '0.4s' }} />
        <CandleGlow style={{ bottom: '20%', left: '32%', animationDelay: '0.8s' }} />
        <CandleGlow style={{ bottom: '20%', left: '38%', animationDelay: '1.2s' }} />

        {/* TV glow */}
        <div className={styles.tvGlow} aria-hidden="true" />

        {/* Gradient overlays */}
        <div className={styles.gradientBottom} />
        <div className={styles.gradientTop} />
        <div className={styles.gradientSides} />
      </div>

      {/* ── PARTICLES ── */}
      <Particles />

      {/* ── MAIN CONTENT ── */}
      <motion.div
        className={styles.content}
        style={{
          opacity: isMobile ? 1 : contentOpacity,
          y: isMobile ? 0 : contentY,
        }}
      >
        {/* Studio label */}
        <motion.div
          className={styles.studioLabel}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          <span className={styles.labelLine} />
          <span>SLEEPING QUARTERS</span>
          <span className={styles.labelLine} />
        </motion.div>

        {/* Main title */}
        <motion.div
          className={styles.titleWrapper}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: 'easeOut' }}
        >
          <h1 className={styles.title} data-text="SLEEP BREAK">
            SLEEP
            <br />
            BREAK
          </h1>
          {/* Glitch layers */}
          <div className={styles.glitchLayer1} aria-hidden="true">
            SLEEP<br />BREAK
          </div>
          <div className={styles.glitchLayer2} aria-hidden="true">
            SLEEP<br />BREAK
          </div>
        </motion.div>

        {/* Tagline */}
        <motion.div
          className={styles.taglineWrapper}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <p className={styles.tagline}>
            The monsters come out at night.
          </p>
          <p className={`${styles.tagline} ${styles.taglinePink}`}>
            So does he.
          </p>
        </motion.div>

        {/* Genre tags */}
        <motion.div
          className={styles.tags}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.7 }}
        >
          {['2D Pixel Art', 'Survival Horror', 'Action', 'Indie'].map(tag => (
            <span key={tag} className={styles.tag}>{tag}</span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className={styles.buttons}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.7 }}
        >
          <a href="#" className={styles.btnPrimary} target="_blank" rel="noopener noreferrer">
            <FaSteam />
            <span>ADD TO WISHLIST</span>
            <span className={styles.btnGlow} aria-hidden="true" />
          </a>

          <a href="https://discord.gg/sleepbreak" className={styles.btnSecondary} target="_blank" rel="noopener noreferrer">
            <FaDiscord />
            <span>JOIN DISCORD</span>
          </a>
        </motion.div>

        {/* Countdown */}
        <motion.div
          className={styles.countdown}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.7 }}
        >
          <p className={styles.countdownLabel}>DEMO DROPS IN</p>
          <div className={styles.countdownTimer}>
            {[
              { value: timeLeft.days, label: 'DAYS' },
              { value: timeLeft.hours, label: 'HRS' },
              { value: timeLeft.minutes, label: 'MIN' },
              { value: timeLeft.seconds, label: 'SEC' },
            ].map((unit, i) => (
              <div key={unit.label} className={styles.timeUnit}>
                <div className={styles.timeBox}>
                  <span className={styles.timeValue}>
                    {pad(unit.value)}
                  </span>
                </div>
                <span className={styles.timeLabel}>{unit.label}</span>
                {i < 3 && (
                  <span className={styles.timeSep}>:</span>
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Game loop preview */}
        <motion.div
          className={styles.loopPreview}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.7 }}
        >
          {[
            { icon: '☀️', label: 'MORNING' },
            { icon: '→', label: null, isSep: true },
            { icon: '🛒', label: 'PREPARE' },
            { icon: '→', label: null, isSep: true },
            { icon: '🌙', label: 'NIGHT' },
            { icon: '→', label: null, isSep: true },
            { icon: '👁️', label: 'SURVIVE' },
          ].map((item, i) => (
            item.isSep
              ? <span key={i} className={styles.loopSep}>{item.icon}</span>
              : (
                <div key={i} className={styles.loopItem}>
                  <span className={styles.loopIcon}>{item.icon}</span>
                  <span className={styles.loopLabel}>{item.label}</span>
                </div>
              )
          ))}
        </motion.div>
      </motion.div>

      {/* ── SCROLL INDICATOR ── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            className={styles.scrollIndicator}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 2.2 }}
          >
            <div className={styles.scrollArrow} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <p className={styles.scrollText}>SCROLL</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── CORNER DECORATIONS ── */}
      <div className={styles.cornerTL} aria-hidden="true" />
      <div className={styles.cornerTR} aria-hidden="true" />
      <div className={styles.cornerBL} aria-hidden="true" />
      <div className={styles.cornerBR} aria-hidden="true" />

      {/* Section divider */}
      <div className={styles.sectionDivider} />
    </section>
  )
}