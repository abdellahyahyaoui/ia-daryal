import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Home, Facebook, Twitter, Instagram, History, ChevronRight } from "lucide-react"
import { getHistory } from "../../utils/historyStorage"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (isOpen) {
      const savedHistory = getHistory()
      console.log("[Navbar] Historial cargado:", savedHistory)
      setHistory(savedHistory || [])
    }
  }, [isOpen])

  return (
    <nav className="navbar-container" style={{ position: 'relative', zIndex: 1000 }}>
      <button
        className={`menu-toggle ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        style={{ zIndex: 1001 }}
      >
        <span />
        <span />
      </button>

      <div className={`nav-links ${isOpen ? "open" : ""}`} style={{ 
        display: isOpen ? 'flex' : 'none',
        flexDirection: 'column',
        backgroundColor: '#1a1a1a',
        position: 'fixed',
        top: 0,
        right: 0,
        height: '100vh',
        width: '280px',
        padding: '80px 20px 20px',
        boxShadow: '-5px 0 15px rgba(0,0,0,0.5)',
        overflowY: 'auto'
      }}>
        <Link to="/" onClick={() => setIsOpen(false)} style={{ color: 'white', padding: '10px 0', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Home size={18} /> Home
        </Link>
        <Link to="/code" onClick={() => setIsOpen(false)} style={{ color: 'white', padding: '10px 0', borderBottom: '1px solid #333' }}>
          Interpretar Código
        </Link>

        {/* Sección de Historial */}
        <div className="history-section" style={{ marginTop: '30px', flex: 1 }}>
          <h3 style={{ 
            fontSize: '11px', 
            fontWeight: '800', 
            textTransform: 'uppercase', 
            color: '#4ade80', 
            letterSpacing: '1px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <History size={14} /> Historial de Diagnósticos
          </h3>
          
          <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.length > 0 ? (
              history.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: '12px', 
                    backgroundColor: '#262626', 
                    borderRadius: '8px', 
                    border: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ color: '#4ade80', fontSize: '10px', fontWeight: 'bold' }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                    <ChevronRight size={12} color="#666" />
                  </div>
                  <p style={{ 
                    margin: 0, 
                    color: '#eee', 
                    fontSize: '12px', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis' 
                  }}>
                    {item.problema || "Sin descripción"}
                  </p>
                </div>
              ))
            ) : (
              <p style={{ color: '#666', fontSize: '11px', fontStyle: 'italic', textAlign: 'center', marginTop: '20px' }}>
                No hay diagnósticos guardados aún.
              </p>
            )}
          </div>
        </div>

        <div className="social-media-menu" style={{ marginTop: 'auto', paddingTop: '20px', display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={{ color: '#666' }}>
            <Facebook size={20} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" style={{ color: '#666' }}>
            <Twitter size={20} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: '#666' }}>
            <Instagram size={20} />
          </a>
        </div>

        <button className="close-btn" onClick={() => setIsOpen(false)} style={{ position: 'absolute', top: '20px', right: '20px', fontSize: '24px', color: '#666' }}>
          ×
        </button>
      </div>
    </nav>
  )
}
