import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Home, Facebook, Twitter, Instagram, History } from "lucide-react"
import { getHistory } from "../../utils/historyStorage"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (isOpen) {
      const savedHistory = getHistory()
      console.log("Historial cargado:", savedHistory)
      setHistory(savedHistory)
    }
  }, [isOpen])

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
        <Link to="/" onClick={() => setIsOpen(false)}>
          <Home size={20} style={{ display: "inline-block", marginRight: "8px" }} />
          Home
        </Link>
        <Link to="/code" onClick={() => setIsOpen(false)}>
          Interpretar Código
        </Link>

        {history && history.length > 0 && (
          <div className="history-section" style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '1rem', width: '100%' }}>
            <h3 style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <History size={14} /> Historial Reciente
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '12rem', overflowY: 'auto' }}>
              {history.map((item) => (
                <div key={item.id} style={{ fontSize: '0.75rem', padding: '0.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '4px', cursor: 'pointer' }}>
                   <p style={{ fontWeight: 'bold', margin: 0, color: 'white' }}>{new Date(item.timestamp).toLocaleDateString()}</p>
                   <p style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{item.problema}</p>
                </div>
              ))}
            </div>
          </div>
        )}

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
