'use client'

import styles from './Logo.module.css'

export default function SleepBreakLogo({ className = '' }) {
  return (
    <div className={`${styles.logoWrap} ${className}`} aria-label="Sleep Break">
      <svg
        className={styles.logoSvg}
        viewBox="0 0 220 140"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
      >
        <defs>
          <filter id="sbGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Hand-drawn-style SB lettering */}
        <g className={styles.sbMark} filter="url(#sbGlow)">
          {/* S */}
          <path
            className={styles.letterStroke}
            d="M 38 58
               C 38 46, 28 42, 20 46
               C 12 50, 12 60, 22 64
               C 32 68, 34 76, 26 81
               C 18 86, 8 82, 8 72"
            fill="none"
          />
          {/* B */}
          <path
            className={styles.letterStroke}
            d="M 58 38
               L 58 92
               M 58 40
               C 76 38, 88 44, 88 54
               C 88 62, 80 66, 70 66
               C 82 66, 92 71, 92 80
               C 92 90, 78 94, 58 91"
            fill="none"
          />
        </g>

        {/* Eyes resting on top of the SB */}
        <g className={styles.eyesGroup}>
          <g className={styles.eye} data-eye="left">
            <ellipse cx="34" cy="24" rx="13" ry="9" className={styles.eyeWhite} />
            <circle cx="34" cy="24" r="5.2" className={styles.pupil} />
          </g>
          <g className={styles.eye} data-eye="right">
            <ellipse cx="70" cy="22" rx="13" ry="9" className={styles.eyeWhite} />
            <circle cx="70" cy="22" r="5.2" className={styles.pupil} />
          </g>
        </g>
      </svg>
    </div>
  )
}