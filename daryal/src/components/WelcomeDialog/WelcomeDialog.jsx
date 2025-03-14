// import React from 'react';
// import './WelcomeDialog.scss';

// function WelcomeDialog({ onStart }) {
//   return (
//     <div className="welcome-dialog">
//       <h1>¡Hola! Soy Daryal,</h1>
//       {/* <p>Embárcate en un viaje de diagnóstico avanzado. Responde algunas preguntas sobre tu vehículo y te proporcionaremos un análisis de última generación.</p> */}
//       <ul>
//         <li> tu IA especializada en averías de coches. Pienso y actúo como un mecánico para ayudarte. Sígueme paso a paso y descríbeme el problema con detalle. ¿Listo? ¡Vamos!</li>
      
//       </ul>
//       <button onClick={onStart}>Iniciar Diagnóstico</button>
//     </div>
//   );
// }

// export default WelcomeDialog;


import { useState, useEffect } from "react"
import "./WelcomeDialog.scss"

function WelcomeDialog({ onStart }) {
  const [text, setText] = useState("")
  const fullText =
    "tu IA especializada en averías de coches. Pienso y actúo como un mecánico para ayudarte. Sígueme paso a paso y descríbeme el problema con detalle. ¿Listo? ¡Vamos!"
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (index < fullText.length) {
      const timer = setTimeout(() => {
        setText((prevText) => prevText + fullText[index])
        setIndex((prevIndex) => prevIndex + 1)
      }, 90) // Ajusta este valor para cambiar la velocidad de escritura

      return () => clearTimeout(timer)
    }
  }, [index]) // Removed unnecessary dependency: fullText

  return (
    <div className="welcome-dialog">
      <h1>¡Hola! Soy Daryal,</h1>
      <ul>
        <li>{text}</li>
      </ul>
      <button onClick={onStart} className={index === fullText.length ? "visible" : "hidden"}>
        Iniciar Diagnóstico
      </button>
    </div>
  )
}

export default WelcomeDialog

