'use client'

import { useState, useEffect, useContext } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useDayNight } from '../../context/DayNightContext'
import styles from './Navbar.module.css'
import { FaDiscord, FaSteam, FaInstagram, FaTiktok, FaYoutube } from 'react-icons/fa'
import SleepBreakLogo from '../Logo/Logo'

const leftLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Gallery', href: '#gallery' },
]

const rightLinks = [
  { label: 'Devlog', href: '#devlog' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeLink, setActiveLink] = useState('home')
  const { isDayMode, toggleDayNight } = useDayNight()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  useEffect(() => {
    const sections = ['home', 'about', 'gallery', 'trailer', 'demo', 'enemies', 'devlog', 'community']

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveLink(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }
    )

    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  const handleNavClick = (href) => {
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <>
      <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuActive : ''}`}>
        <div className={styles.navInner}>

          <div className={styles.navLeft}>
            {leftLinks.map(link => (
              <button
                key={link.label}
                className={`${styles.navLink} ${activeLink === link.href.replace('#', '') ? styles.active : ''}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
                <span className={styles.activeDot} />
              </button>
            ))}
          </div>

          <div className={styles.divider} />

          <button
            className={styles.logoBtn}
            onClick={() => handleNavClick('#home')}
            aria-label="Sleep Break — Home"
          >
            <SleepBreakLogo />
          </button>

          <div className={styles.divider} />

          <div className={styles.navRight}>
            {rightLinks.map(link => (
              <button
                key={link.label}
                className={`${styles.navLink} ${activeLink === link.href.replace('#', '') ? styles.active : ''}`}
                onClick={() => handleNavClick(link.href)}
              >
                {link.label}
                <span className={styles.activeDot} />
              </button>
            ))}

            <button
              className={styles.toggleBtn}
              onClick={toggleDayNight}
              aria-label="Toggle day/night mode"
              title={isDayMode ? 'Switch to Night Mode' : 'Switch to Day Mode'}
            >
              <span className={styles.toggleIcon}>
                {isDayMode ? '☀️' : '🌙'}
              </span>
            </button>

            
            <a  
            href="https://discord.gg/sleepbreak"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.discordBtn}
            >
              <FaDiscord className={styles.btnIcon} />
              Discord
            </a>

            
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBtn}
            >
              <span className={styles.ctaBtnInner}>
                <FaSteam className={styles.btnIcon} />
                Add to Wishlist
              </span>
            </a>
          </div>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.mobileMenu}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          >
            <div className={styles.mobileNoise} />

            <button
              className={styles.mobileClose}
              onClick={() => setMenuOpen(false)}
            >
              ✕
            </button>

            <div className={styles.mobileLogo}>
              <SleepBreakLogo />
            </div>

            <nav className={styles.mobileLinks}>
              {[...leftLinks, ...rightLinks,
                { label: 'Demo', href: '#demo' },
                { label: 'Community', href: '#community' }
              ].map((link, i) => (
                <motion.button
                  key={link.label}
                  className={styles.mobileLink}
                  onClick={() => handleNavClick(link.href)}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4 }}
                >
                  <span className={styles.mobileLinkNum}>
                    0{i + 1}
                  </span>
                  {link.label}
                  <span className={styles.mobileLinkArrow}>→</span>
                </motion.button>
              ))}
            </nav>

            <div className={styles.mobileBottom}>
              <button
                className={styles.mobileToggle}
                onClick={toggleDayNight}
              >
                {isDayMode ? '☀️ Day Mode' : '🌙 Night Mode'}
              </button>

              
              <a
                href="https://discord.gg/sleepbreak"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileDiscord}
              >
                <FaDiscord className={styles.btnIcon} />
                Join Discord
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.mobileCta}
              >
                <FaSteam className={styles.btnIcon} />
                Add to Wishlist
              </a>

              <div className={styles.mobileSocials}>
                <a href="https://www.instagram.com/sleep.break/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <FaInstagram />
                </a>
                <a href="https://www.tiktok.com/@sleep.break" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                  <FaTiktok />
                </a>
                <a href="https://www.youtube.com/channel/UCBYmUTSM2VYazHUfFAvqSSw" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                  <FaYoutube />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}