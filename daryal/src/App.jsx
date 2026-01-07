import { useEffect } from "react"
import { HashRouter as Router, Route, Routes } from "react-router-dom"
import ErrorBoundary from "./ErrorBoundary"
import Navbar from "./components/navbar/Navbar"
import Home from "./components/home/Home"
import CodeInterpreter from "./components/CodeInterpreterForm/CodeInterpreter"

function App() {
  useEffect(() => {
    const setVH = () => {
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      )
    }

    setVH()
    window.addEventListener("resize", setVH)
    return () => window.removeEventListener("resize", setVH)
  }, [])

  return (
    <Router>
      <ErrorBoundary>
        <div className="app-root">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/code" element={<CodeInterpreter />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App
