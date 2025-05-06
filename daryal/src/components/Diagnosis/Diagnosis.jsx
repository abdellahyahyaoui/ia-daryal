// import React from 'react';
// import './Diagnosis.scss';

// function Diagnosis({ diagnosis }) {
//   const [diagnostico, ...soluciones] = diagnosis.split('\n');

//   return (
//     <div className="diagnosis">
//       <h2>Diagnóstico Avanzado</h2>
//       <p>{diagnostico}</p>
//       <h3>Soluciones Recomendadas</h3>
//       <ul>
//         {soluciones.map((solucion, index) => (
//           <li key={index}>{solucion}</li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// export default Diagnosis;
"use client"

import { useEffect, useState } from "react"
import "./Diagnosis.scss"

function Diagnosis({ diagnosis }) {
  const [diagnostico, setDiagnostico] = useState("")
  const [soluciones, setSoluciones] = useState([])

  useEffect(() => {
    if (diagnosis) {
      console.log("Diagnóstico recibido en componente:", diagnosis)

      // Manejar diferentes formatos posibles del diagnóstico
      if (typeof diagnosis === "object") {
        // Si es un objeto, extraer las partes relevantes
        setDiagnostico(diagnosis.diagnostico || diagnosis.diagnosis || "Diagnóstico no disponible")
        setSoluciones(diagnosis.soluciones || diagnosis.solutions || [])
      } else {
        // Si es una cadena, dividirla en líneas
        const partes = diagnosis.split("\n")
        if (partes.length > 0) {
          setDiagnostico(partes[0])
          setSoluciones(partes.slice(1).filter((s) => s.trim() !== ""))
        } else {
          setDiagnostico(diagnosis)
          setSoluciones([])
        }
      }
    }
  }, [diagnosis])

  return (
    <div className="diagnosis">
      <h2>Diagnóstico Avanzado</h2>
      <p>{diagnostico}</p>

      <h3>Soluciones Recomendadas</h3>
      {soluciones.length > 0 ? (
        <ul>
          {soluciones.map((solucion, index) => (
            <li key={index}>{solucion}</li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron soluciones específicas. Te recomendamos consultar con un mecánico profesional.</p>
      )}

      <div className="diagnosis-footer">
        <button onClick={() => window.print()} className="print-button">
          Imprimir diagnóstico
        </button>
      </div>
    </div>
  )
}

export default Diagnosis
