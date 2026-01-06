"use client"

import { useState } from "react"
import { Menu, X, Car, Bike, Zap, CloverIcon as ScooterIcon } from "lucide-react"
import "./Sidebar.css"

export default function Sidebar({ currentSection, onSectionChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const sections = [
    { id: "ecar", label: "Diagnóstico de Autos", icon: Car },
    { id: "moto", label: "Diagnóstico de Motos", icon: Bike },
    { id: "emoto", label: "Motos Eléctricas", icon: Zap },
    { id: "orbea", label: "E-Bikes", icon: Bike },
    { id: "epatinete", label: "Patinetes Eléctricos", icon: ScooterIcon },
  ]

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId)
    setIsOpen(false)
  }

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-card hover:bg-accent transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full p-4 pt-16">
          <h2 className="text-lg font-semibold mb-4 text-sidebar-foreground">Diagnóstico con IA</h2>

          <nav className="flex-1 space-y-2">
            {sections.map((section) => {
              const Icon = section.icon
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    currentSection === section.id
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground"
                  }`}
                >
                  <Icon size={18} />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </nav>
        </div>
      </aside>
    </>
  )
}
