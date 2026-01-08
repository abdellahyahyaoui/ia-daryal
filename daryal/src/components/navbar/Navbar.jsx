import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Home, Facebook, Twitter, Instagram, History, Activity } from "lucide-react"
import { getHistory } from "../../utils/historyStorage"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([])
  const menuWrapperRef = useRef(null)
  const navigate = useNavigate()

  // Maneja clicks fuera del menú y del toggle
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuWrapperRef.current && !menuWrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Carga historial
  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = getHistory()
      setHistory(savedHistory || [])
    }

    loadHistory()
    window.addEventListener("history-updated", loadHistory)
    return () => window.removeEventListener("history-updated", loadHistory)
  }, [])

  const handleSelectHistory = (item) => {
    const event = new CustomEvent('load-diagnosis', { detail: item })
    window.dispatchEvent(event)
    setIsOpen(false)
  }

  const handleGoHome = () => {
    navigate("/")  // Fuerza navegar a la pantalla principal
    const resetEvent = new CustomEvent("reset-diagnosis")
    window.dispatchEvent(resetEvent)
    setIsOpen(false)
  }

  return (
    <nav className="navbar-container" ref={menuWrapperRef}>
      {/* Botón Toggle */}
      <button
        className={`menu-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span />
        <span />
      </button>

      {/* Menú */}
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <button onClick={handleGoHome} className="nav-link home-link">
          <Home size={18} /> Home
        </button>

        <button onClick={handleGoHome} className="nav-link">
          <Activity size={18} /> Diagnóstico
        </button>

        <Link to="/code" onClick={() => setIsOpen(false)} className="nav-link">
          Interpretar Código
        </Link>

        {/* Historial */}
        <div className="history-section">
          <h3 className="history-title">
            <History size={25} /> Historial 
          </h3>

          <div className="history-list">
            {history.length > 0 ? (
              history.map((item) => (
                <button
                  key={item.id}
                  className="history-item"
                  onClick={() => handleSelectHistory(item)}
                >
                  <div className="history-item-header">
                    <span className="history-date">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="history-problema">{item.problema}</p>
                </button>
              ))
            ) : (
              <div className="history-empty">
                <p>Aún no tienes diagnósticos guardados.</p>
              </div>
            )}
          </div>
        </div>

        {/* Redes sociales */}
        <div className="social-media-menu">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
            <Instagram size={20} />
          </a>
        </div>

        {/* Botón cerrar */}
        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>
    </nav>
  )
}
