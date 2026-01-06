import React, { useState } from "react"
import { Link } from "react-router-dom"
import { Menu as MenuIcon, X } from "lucide-react"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="navbar-container">
      <button className="menu-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
      </button>
      
      <div className={`nav-links ${isOpen ? "open" : ""}`}>
        <Link to="/" onClick={() => setIsOpen(false)}>Inicio</Link>
        <Link to="/moto" onClick={() => setIsOpen(false)}>Moto</Link>
        <Link to="/ecar" onClick={() => setIsOpen(false)}>Coche Eléctrico</Link>
        <Link to="/emoto" onClick={() => setIsOpen(false)}>Moto Eléctrica</Link>
        <Link to="/epatinete" onClick={() => setIsOpen(false)}>Patinete Eléctrico</Link>
        <Link to="/orbea" onClick={() => setIsOpen(false)}>Orbea</Link>
        <Link to="/code" onClick={() => setIsOpen(false)}>Código</Link>
      </div>
    </nav>
  )
}
