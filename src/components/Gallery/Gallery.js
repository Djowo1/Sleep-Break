'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-coverflow'
import { Navigation, Pagination, EffectCoverflow } from 'swiper/modules'
import styles from './Gallery.module.css'

const galleryImages = [
  { src: '/images/gallery/gallery-1.jpg', title: 'The Old Room' },
  { src: '/images/gallery/gallery-2.jpg', title: 'Nightmare Hall' },
  { src: '/images/gallery/gallery-3.jpg', title: 'Corrupted TV' },
  { src: '/images/gallery/gallery-4.jpg', title: 'Shadow Figure' },
  { src: '/images/gallery/gallery-5.jpg', title: 'Broken Toys' },
  { src: '/images/gallery/gallery-6.jpg', title: 'Escape Route' },
]

export default function Gallery() {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [initialSlide, setInitialSlide] = useState(0)

  const openLightbox = (index) => {
    setInitialSlide(index)
    setLightboxOpen(true)
  }

  const closeLightbox = () => {
    setLightboxOpen(false)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeLightbox()
      }
    }
    if (lightboxOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [lightboxOpen])

  return (
    <section id="gallery" className={styles.gallery}>
      <h2 className={styles.title}>ENTER THE NIGHTMARE</h2>

      <div className={styles.carouselContainer}>
        {galleryImages.map((img, index) => (
          <div
            key={index}
            className={styles.carouselItem}
            style={{ '--angle': `${index * 60}deg` }}
            onClick={() => openLightbox(index)}
          >
            <Image src={img.src} alt={img.title} width={260} height={340} className={styles.cardImage} />
            <div className={styles.cardTitle}>{img.title}</div>
            <div className={styles.cardBorder} />
          </div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the swiper itself
            >
              <button className={styles.closeButton} onClick={closeLightbox}>
                &times;
              </button>
              <Swiper
                initialSlide={initialSlide}
                navigation
                pagination={{ clickable: true }}
                modules={[Navigation, Pagination, EffectCoverflow]}
                effect="coverflow"
                centeredSlides
                slidesPerView={'auto'}
                coverflowEffect={{
                  rotate: 50,
                  stretch: 0,
                  depth: 100,
                  modifier: 1,
                  slideShadows: true,
                }}
                className={styles.mySwiper}
              >
                {galleryImages.map((img, index) => (
                  <SwiperSlide key={index} className={styles.swiperSlide}>
                    <Image src={img.src} alt={img.title} layout="fill" objectFit="contain" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
