'use client'
import React, { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import styles from './Trailer.module.css'

export default function Trailer() {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoRef = useRef(null)
  const audioRef = useRef(null)

  const handlePlay = () => {
    setIsPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
    if (audioRef.current) {
      audioRef.current.play()
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
  }

  useEffect(() => {
    const videoElement = videoRef.current
    if (videoElement) {
      videoElement.addEventListener('ended', handleVideoEnd)
      return () => {
        videoElement.removeEventListener('ended', handleVideoEnd)
      }
    }
  }, [])

  return (
    <section id="trailer" className={styles.trailer}>
      <div className={styles.tvContainer}>
        <div className={styles.tvBezel}>
          <div className={styles.tvScreen}>
            {!isPlaying ? (
              <div className={styles.staticEffect} onClick={handlePlay}>
                <div className={styles.crawlingImage} />
                <motion.p
                  className={styles.playText}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ▶ PLAY TRAILER
                </motion.p>
                <p className={styles.placeholderText}>TRAILER COMING SOON</p>
              </div>
            ) : (
              <video
                ref={videoRef}
                src="/videos/trailer.mp4" // Placeholder video
                className={styles.videoPlayer}
                controls
              />
            )}
            <div className={styles.scanlines} />
            <div className={styles.colorAberration} />
          </div>
          <div className={styles.tvAntenna} />
          <div className={styles.tvLegLeft} />
          <div className={styles.tvLegRight} />
        </div>
      </div>
      <div className={styles.textBelowTv}>
        <h3 className={styles.mainText}>The monsters come from in there.</h3>
        <p className={styles.subText}>Every. Single. Night.</p>
      </div>
      <audio ref={audioRef} src="/audio/glitch-sound.mp3" preload="auto" />
    </section>
  )
}
