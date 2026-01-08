import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Home, Facebook, Twitter, Instagram, History, ChevronRight } from "lucide-react"
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
    
    // Listen for history updates
    window.addEventListener('history-updated', loadHistory)
    return () => window.removeEventListener('history-updated', loadHistory)
  }, [])

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

        {/* Sección de Historial - Muy visible */}
        <div className="history-section" style={{ 
          marginTop: '40px', 
          width: '100%', 
          borderTop: '2px solid #4ade80', 
          paddingTop: '20px',
          display: 'block'
        }}>
          <h3 style={{ 
            fontSize: '14px', 
            fontWeight: 'bold', 
            textTransform: 'uppercase', 
            color: '#4ade80', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <History size={18} /> Historial Reciente
          </h3>
          
          <div className="history-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {history && history.length > 0 ? (
              history.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    padding: '15px', 
                    backgroundColor: '#2a2a2a', 
                    borderRadius: '10px', 
                    border: '1px solid #444',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 'bold' }}>
                      {new Date(item.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <p style={{ margin: '8px 0 0', color: '#fff', fontSize: '13px', lineHeight: '1.4' }}>
                    {item.problema}
                  </p>
                </div>
              ))
            ) : (
              <div style={{ padding: '20px', textAlign: 'center', border: '1px dashed #444', borderRadius: '10px' }}>
                <p style={{ color: '#888', fontSize: '12px', margin: 0 }}>
                  Aún no tienes diagnósticos guardados.
                </p>
              </div>
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
