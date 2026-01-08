import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Home, Facebook, Twitter, Instagram, History } from "lucide-react"
import { getHistory } from "../../utils/historyStorage"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    const loadHistory = () => {
      const savedHistory = getHistory()
      console.log("[Navbar] Historial cargado:", savedHistory)
      setHistory(savedHistory || [])
    }

    loadHistory()
    
    window.addEventListener('history-updated', loadHistory)
    return () => window.removeEventListener('history-updated', loadHistory)
  }, [])

  return (
    <nav className="navbar-container">
      <button
        className={`menu-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span />
        <span />
      </button>

      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)} className="nav-link home-link">
          <Home size={18} /> Home
        </Link>

        <Link to="/code" onClick={() => setIsOpen(false)} className="nav-link">
          Interpretar Código
        </Link>

        <div className="history-section">
          <h3 className="history-title">
            <History size={18} /> Historial Reciente
          </h3>

          <div className="history-list">
            {history && history.length > 0 ? (
              history.map((item) => (
                <div key={item.id} className="history-item">
                  <div className="history-item-header">
                    <span className="history-date">
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="history-problema">{item.problema}</p>
                </div>
              ))
            ) : (
              <div className="history-empty">
                <p>Aún no tienes diagnósticos guardados.</p>
              </div>
            )}
          </div>
        </div>

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

        <button className="close-btn" onClick={() => setIsOpen(false)}>
          ×
        </button>
      </div>
    </nav>
  )
}
