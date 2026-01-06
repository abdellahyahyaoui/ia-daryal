


import { useEffect, useRef } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import CodeInterpreter from "./components/CodeInterpreterForm/CodeInterpreter"

function App() {
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

