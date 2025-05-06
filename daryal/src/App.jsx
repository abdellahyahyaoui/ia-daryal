


"use client"

// Este es un ejemplo de cómo modificar App.jsx para manejar la transición del robot
// Solo incluyo las partes relevantes que necesitas modificar

import { useEffect, useRef } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import Logo from "./components/logo/Logo"
import Robot from "./components/robot/Robot"
import Lamp from "./components/Lamp/Lamp"
import CodeInterpreter from "./components/CodeInterpreterForm/CodeInterpreter"
import HeroGeometricBackground from "./components/Herobackground/HeroGeometricBackground"
import "./App.scss"

// Importar los componentes de diagnóstico
import MotorcycleDiagnosis from "./components/MotorcycleForm/MotorcycleDiagnosis"
import ElectricCarDiagnosis from "./components/ElectricCarForm/ElectricCarDiagnosis"
import ElectricMotorcycleDiagnosis from "./components/ElectricMotorcycleForm/ElectricMotorcycleDiagnosis"
import ElectricScooterDiagnosis from "./components/ElectricScooterForm/ElectricScooterDiagnosis"
import Fondo from "./components/fondo/Fondo"
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
        
          <HeroGeometricBackground />
          
          <div className="menu-completo">
            <div className="Logo">
              <Logo />
            </div>
            <div className="navegacion">
              <Navbar />
            </div>
          </div>

          <div className="centro">
            <div className="cuerpo">
              <div className="robot" ref={robotRef}>
                <Robot />
              </div>

              <div className="contenido">
                
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/code" element={<CodeInterpreter />} />
                  <Route path="/moto" element={<MotorcycleDiagnosis />} />
                  <Route path="/emoto" element={<ElectricMotorcycleDiagnosis />} />
                  <Route path="/ecar" element={<ElectricCarDiagnosis />} />
                  <Route path="/epatinete" element={<ElectricScooterDiagnosis />} />
                </Routes>
              </div>
              
              
              <Fondo />
            </div>
            <div className="lamp">
              <Lamp />
            </div>
          </div>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App

