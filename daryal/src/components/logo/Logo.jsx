// Logo.jsx
'use client'

import { useState, useEffect } from 'react'
import './Logo.scss'

export default function Logo() {
  const [hoveredIndex, setHoveredIndex] = useState(-1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const letters = 'Daryal'

  return (
    <div className="container">
      <div className="letters">
        {letters.split('').map((letter, index) => (
          <span
            key={index}
            className={`letter logo ${hoveredIndex === index ? 'hovered' : ''} ${isVisible ? 'visible' : ''}`}
            style={{ transitionDelay: `${index * 120}ms` }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(-1)}
          >
            {letter}
          </span>
        ))}
        <span 
          className={`suffix logo ${isVisible ? 'visible' : ''}`}
          style={{ transitionDelay: `${letters.length * 120}ms` }}
        >
          
        </span>
      </div>
    </div>
  )
}
