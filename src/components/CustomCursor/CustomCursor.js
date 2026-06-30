'use client'

import { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'
import styles from './CustomCursor.module.css'

export default function CustomCursor() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [followerPos, setFollowerPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const followerRef = useRef({ x: 0, y: 0 })
  const animFrameRef = useRef()

  useEffect(() => {
    const handleMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleLeave = () => setIsVisible(false)
    const handleEnter = () => setIsVisible(true)

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseleave', handleLeave)
    document.addEventListener('mouseenter', handleEnter)

    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleLeave)
      document.removeEventListener('mouseenter', handleEnter)
    }
  }, [isVisible])

  // Smooth follower with lerp
  useEffect(() => {
    const lerp = (start, end, factor) => start + (end - start) * factor

    const animate = () => {
      followerRef.current.x = lerp(followerRef.current.x, mousePos.x, 0.08)
      followerRef.current.y = lerp(followerRef.current.y, mousePos.y, 0.08)
      setFollowerPos({ x: followerRef.current.x, y: followerRef.current.y })
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [mousePos])

  // Detect hoverable elements
  useEffect(() => {
    const addHover = () => setIsHovering(true)
    const removeHover = () => setIsHovering(false)

    const hoverEls = document.querySelectorAll(
      'a, button, [data-cursor-hover]'
    )

    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', removeHover)
    })

    return () => {
      hoverEls.forEach(el => {
        el.removeEventListener('mouseenter', addHover)
        el.removeEventListener('mouseleave', removeHover)
      })
    }
  })

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null
  }

  return (
    <>
      {/* Main cursor dot */}
      <div
        className={`${styles.cursor} ${isClicking ? styles.clicking : ''} ${!isVisible ? styles.hidden : ''}`}
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      >
        {/* Crosshair lines */}
        <span className={styles.crossH} />
        <span className={styles.crossV} />
      </div>

      {/* Follower glow ring */}
      <div
        className={`${styles.follower} ${isHovering ? styles.hovering : ''} ${isClicking ? styles.followerClick : ''} ${!isVisible ? styles.hidden : ''}`}
        style={{
          left: `${followerPos.x}px`,
          top: `${followerPos.y}px`,
        }}
      >
        {isHovering && (
          <span className={styles.eyeIcon}>👁️</span>
        )}
      </div>
    </>
  )
}