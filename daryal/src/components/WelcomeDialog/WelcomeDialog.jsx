

"use client"

import { useState, useEffect } from "react"
import "./WelcomeDialog.scss"

function WelcomeDialog({ onStart, onOBDClick, onManualClick }) {
  const [text, setText] = useState("")
  const [showText, setShowText] = useState(true)
  const [showButton, setShowButton] = useState(false)

  const fullText =
    " tu experto en  averías de coches!"
  const [index, setIndex] = useState(0)

  // Efecto para la animación de escritura
  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setText((prevText) => prevText + fullText[index])
        setIndex((prevIndex) => prevIndex + 1)
      }, 80) // Velocidad de escritura

      return () => clearTimeout(timer)
    } else {
      // Cuando termina de escribir, espera un momento y luego oculta el texto
      const hideTextTimer = setTimeout(() => {
        setShowText(false)

        // Muestra el botón después de que desaparezca el texto
        setTimeout(() => {
          setShowButton(true)
        }, 500)
      }, 1000) // Espera 2 segundos antes de ocultar el texto

      return () => clearTimeout(hideTextTimer)
    }
  }, [index, fullText])

  return (
    <div className="welcome-dialog">
      {showText && (
        <div className="text-content">
          <h1>¡Hola! Soy Daryal</h1>
          <ul>
            <li>{text}</li>
          </ul>
        </div>
      )}

      {showButton && (
        <div className="welcome-options-container">
          <div className="button-content">
            <button onClick={onStart} className="start-btn">Diagnóstico Manual</button>
          </div>
          <div className="quick-access">
            {/* <p>O identifícate automáticamente:</p> */}
            <div className="quick-buttons">
              <button className="start-btn" onClick={onOBDClick}>
          Diagnóstico OBD-II
              </button>
              {/* <button className="start-btn" onClick={onManualClick}>
                📄 Ficha
              </button> */}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default WelcomeDialog
