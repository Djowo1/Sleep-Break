'use client'
import React from 'react'
import styles from './About.module.css'

export default function About() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <div className={styles.left}>
          <div className={styles.imageContainer}>
            <img src="/images/hero/horror-bedroom.png" alt="Night Bedroom" className={styles.imageNight} />
            <img src="/images/hero/horror-bedroom.png" alt="Day Bedroom" className={styles.imageDay} />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.content}>
            <p className={styles.label}>WHAT IS SLEEP BREAK</p>
            <h2>A kid. A VR headset. Seven nights of hell.</h2>
            <p>
              Sleep Break is a 2D pixel-art survival action game about a kid secretly playing VR after bedtime. During the day, earn money through chores. At night, fight monsters crawling out of your television. The catch? You're not supposed to be awake.
            </p>
            <div className={styles.gameplayLoop}>
              <div className={styles.step}>
                <span className={styles.icon}>☀️</span>
                <p>MORNING</p>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.step}>
                <span className={styles.icon}>🛒</span>
                <p>EVENING</p>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.step}>
                <span className={styles.icon}>🌙</span>
                <p>NIGHT</p>
              </div>
              <div className={styles.arrow}>→</div>
              <div className={styles.step}>
                <span className={styles.icon}>🔁</span>
                <p>REPEAT</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
