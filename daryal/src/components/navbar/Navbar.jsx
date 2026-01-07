"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Home, Facebook, Twitter, Instagram } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

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
