'use client'
import React from 'react'
import { features } from '../../data/features'
import styles from './Features.module.css'

export default function Features() {
  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <h2 className={styles.title}>Features</h2>
        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
