


"use client"

// Este es un ejemplo de cómo modificar App.jsx para manejar la transición del robot
// Solo incluyo las partes relevantes que necesitas modificar

import { useEffect, useRef } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import Robot from "./components/robot/Robot"

import CodeInterpreter from "./components/CodeInterpreterForm/CodeInterpreter"

// Importar los componentes de diagnóstico
import MotorcycleDiagnosis from "./components/MotorcycleForm/MotorcycleDiagnosis"
import ElectricCarDiagnosis from "./components/ElectricCarForm/ElectricCarDiagnosis"
import ElectricMotorcycleDiagnosis from "./components/ElectricMotorcycleForm/ElectricMotorcycleDiagnosis"
import ElectricScooterDiagnosis from "./components/ElectricScooterForm/ElectricScooterDiagnosis"
import OrbeaDiagnosis from "./components/OrbeaForm/OrbeaDiagnosis"

function App() {
  const robotRef = useRef(null)

  useEffect(() => {
    // Escuchar el evento personalizado emitido desde Home.jsx
    const handleTypingComplete = (event) => {
      if (event.detail.complete && robotRef.current) {
        // Aplicar la transición al robot para centrarlo
        const robotElement = document.querySelector(".robot")
        if (robotElement) {
          robotElement.classList.add("robot-centered")
        }
      }
    }

    document.addEventListener("typingComplete", handleTypingComplete)

    return () => {
      document.removeEventListener("typingComplete", handleTypingComplete)
    }
  }, [])

  return (
    <Router>
      <ErrorBoundary>
        <div>
        
         
          
          <div className="menu-completo">
            <div className="Logo">
            </div>
            <div className="navegacion">
              <Navbar />
            </div>
          </div>

          <div className="centro">
            <div className="cuerpo">
              <div className="contenido">
                
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/code" element={<CodeInterpreter />} />
                </Routes>
              </div>
              
              
            
            </div>
            
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App

