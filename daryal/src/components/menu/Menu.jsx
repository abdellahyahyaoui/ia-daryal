// "use client"

// import { useState, useRef, useEffect } from "react"
// import { Link } from "react-router-dom"
// import { FaBars, FaTimes, FaBolt } from "react-icons/fa"
// import "./Menu.scss"

// export default function Menu() {
//   const [isOpen, setIsOpen] = useState(false)
//   const [showElectricSubmenu, setShowElectricSubmenu] = useState(false)
//   const menuRef = useRef(null)

//   const toggleMenu = () => {
//     setIsOpen(!isOpen)
//   }

//   const toggleElectricSubmenu = (e) => {
//     if (window.innerWidth <= 768) {
//       e.preventDefault()
//       setShowElectricSubmenu(!showElectricSubmenu)
//     }
//   }

//   // Cerrar el menú al hacer clic fuera de él
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (menuRef.current && !menuRef.current.contains(event.target)) {
//         setIsOpen(false)
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside)
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside)
//     }
//   }, [menuRef])

//   return (
//     <div className="menu-container" ref={menuRef}>
//       {/* Botón hamburguesa para móviles */}
//       <button className="menu-toggle" onClick={toggleMenu}>
//         {isOpen ? <FaTimes /> : <FaBars />}
//       </button>

//       {/* Menú principal */}
//       <div className={`menu ${isOpen ? "open" : ""}`}>
//         <Link to="/" className="menu-item">
//           Coches
//         </Link>
//         <Link to="/code" className="menu-item">
//           Códigos
//         </Link>
//         <Link to="/moto" className="menu-item">
//           Motos
//         </Link>

//         {/* Categoría de vehículos eléctricos */}
//         <div className="electric-category">
//           <Link to="/electric" className="menu-item electric-menu-item" onClick={toggleElectricSubmenu}>
//             <FaBolt className="electric-icon" /> Eléctricos
//           </Link>

//           {/* Submenú de vehículos eléctricos */}
//           <div className={`electric-submenu ${showElectricSubmenu ? "show" : ""}`}>
//             <Link to="/ecar" className="submenu-item">
//               Coche Eléctrico
//             </Link>
//             <Link to="/emoto" className="submenu-item">
//               Moto Eléctrica
//             </Link>
//             <Link to="/epatinete" className="submenu-item">
//               Patinete Eléctrico
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
"use client"

import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { FaBars, FaTimes, FaBolt, FaCar, FaCode, FaMotorcycle } from "react-icons/fa"
import "./Menu.scss"
import Logo from "../logo/Logo"

export default function Menu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showElectricSubmenu, setShowElectricSubmenu] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const menuRef = useRef(null)

  // Detectar si es dispositivo móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    // Comprobar al cargar
    checkIfMobile()

    // Comprobar al cambiar el tamaño de la ventana
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const toggleElectricSubmenu = (e) => {
    e.preventDefault()
    setShowElectricSubmenu(!showElectricSubmenu)
  }

  // Cerrar el menú al hacer clic fuera de él
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuRef])

  // Renderizar el botón de hamburguesa para móvil en el centro
  const renderMobileButton = () => {
    if (isMobile) {
      return (
        <button className="mobile-menu-toggle" onClick={toggleMenu}>
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>
      )
    }
    return null
  }

  return (
    <>
      {/* Botón de hamburguesa para móvil (centrado) */}
      {renderMobileButton()}

      {/* Menú lateral */}
      <div className={`sidebar-menu ${isOpen ? "open" : ""} ${isMobile ? "mobile" : ""}`} ref={menuRef}>
        {/* Botón hamburguesa para desktop (solo visible en desktop) */}
        {!isMobile && (
          <button className="menu-toggle" onClick={toggleMenu}>
            {isOpen ? <FaTimes /> : <FaBars />}
          </button>
        )}

        {/* Contenido del menú lateral */}
        <div className="sidebar-content">
          {/* Logo en la parte superior del menú (solo visible cuando está abierto) */}
          {isOpen && (
            <div className="sidebar-logo">
              {/* <Logo /> */}
            </div>
          )}

          {/* Enlaces del menú */}
          <nav className="sidebar-nav">
            <Link to="/" className="menu-item" onClick={() => setIsOpen(false)}>
              <span className="menu-icon">
                <FaCar />
              </span>
              <span className="menu-text">Coches</span>
            </Link>

            <Link to="/code" className="menu-item" onClick={() => setIsOpen(false)}>
              <span className="menu-icon">
                <FaCode />
              </span>
              <span className="menu-text">Códigos</span>
            </Link>

            <Link to="/moto" className="menu-item" onClick={() => setIsOpen(false)}>
              <span className="menu-icon">
                <FaMotorcycle />
              </span>
              <span className="menu-text">Motos</span>
            </Link>

            {/* Categoría de vehículos eléctricos */}
            <div className="electric-category">
              <button className="menu-item electric-menu-item" onClick={toggleElectricSubmenu}>
                <span className="menu-icon">
                  <FaBolt />
                </span>
                <span className="menu-text">Eléctricos</span>
              </button>

              {/* Submenú de vehículos eléctricos (solo visible cuando el menú está abierto) */}
              {isOpen && (
                <div className={`electric-submenu ${showElectricSubmenu ? "show" : ""}`}>
                  <Link to="/ecar" className="submenu-item" onClick={() => setIsOpen(false)}>
                    Coche Eléctrico
                  </Link>
                  <Link to="/emoto" className="submenu-item" onClick={() => setIsOpen(false)}>
                    Moto Eléctrica
                  </Link>
                  <Link to="/epatinete" className="submenu-item" onClick={() => setIsOpen(false)}>
                    Patinete Eléctrico
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
