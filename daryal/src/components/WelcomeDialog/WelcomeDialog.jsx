

// import { useState, useEffect } from "react"
// import "./WelcomeDialog.scss"

// function WelcomeDialog({ onStart }) {
//   const [text, setText] = useState("")
//   const fullText =
//     "tu IA especializada en averías de coches. Pienso y actúo como un mecánico para ayudarte. Sígueme paso a paso y descríbeme el problema con detalle. ¿Listo? ¡Vamos!"
//   const [index, setIndex] = useState(0)

//   useEffect(() => {
//     if (index < fullText.length) {
//       const timer = setTimeout(() => {
//         setText((prevText) => prevText + fullText[index])
//         setIndex((prevIndex) => prevIndex + 1)
//       }, 90) // Ajusta este valor para cambiar la velocidad de escritura

//       return () => clearTimeout(timer)
//     }
//   }, [index]) // Removed unnecessary dependency: fullText

//   return (
//     <div className="welcome-dialog">
//       <h1>¡Hola! Soy Daryal,</h1>
//       <ul>
//         <li>{text}</li>
//       </ul>
//       <button onClick={onStart} className={index === fullText.length ? "visible" : "hidden"}>
//         Iniciar Diagnóstico
//       </button>
//     </div>
//   )
// }

// export default WelcomeDialog

"use client"

import { useState, useEffect } from "react"
import "./WelcomeDialog.scss"

function WelcomeDialog({ onStart }) {
  const [text, setText] = useState("")
  const [showText, setShowText] = useState(true)
  const [showButton, setShowButton] = useState(false)

  const fullText =
    " experto en detectar averías de coches. Con mi entrenamiento y precisión, vamos a encontrar el problema rápidamente y te daré la mejor solución. ¡Estás en las mejores manos!"
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
          <h1>¡Hola! Soy Deryal</h1>
          <ul>
            <li>{text}</li>
          </ul>
        </div>
      )}

      {showButton && (
        <div className="button-content">
          <button onClick={onStart}>Iniciar Diagnóstico</button>
        </div>
      )}
    </div>
  )
}

export default WelcomeDialog
