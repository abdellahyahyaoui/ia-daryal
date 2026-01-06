"use client"

import { useState, useEffect } from "react"

const electricScooterBrands = [
  "Xiaomi",
  "Segway-Ninebot",
  "Cecotec",
  "Hiboy",
  "Razor",
  "Inokim",
  "Dualtron",
  "Kaabo",
  "Apollo",
  "Kugoo",
  "Joyor",
  "E-TWOW",
  "SmartGyro",
  "Zwheel",
  "Zeeclo",
  "Moma Bikes",
  "Megawheels",
  "Techlife",
  "Ecoxtrem",
  "Ducati",
  "BMW",
  "Mercedes-Benz",
  "Seat",
  "otro"
]

const batteryRanges = ["Menos de 15 km", "15-25 km", "25-35 km", "35-45 km", "Más de 45 km"]

function ElectricScooterForm({ onSubmit }) {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [batteryRange, setBatteryRange] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estado para el efecto de escritura del título
  const [formTitle, setFormTitle] = useState("")
  const [showTitle, setShowTitle] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const fullTitle = ""

  // Efecto para la animación de escritura del título
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullTitle.length) {
        setFormTitle((prev) => prev + fullTitle[index])
        index++
      } else {
        clearInterval(timer)

        // Esperar un momento después de completar la escritura
        setTimeout(() => {
          // Ocultar el título con una animación de desvanecimiento
          setShowTitle(false)

          // Mostrar el formulario después de que el título desaparezca
          setTimeout(() => {
            setShowForm(true)
          }, 500) // Tiempo para la transición de desvanecimiento
        }, 1000) // Tiempo que el título permanece visible después de completarse
      }
    }, 90) // Velocidad de escritura

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
     await onSubmit({
  marca: brand,
  modelo: model,
  autonomia: batteryRange,
  tipo_vehiculo: "patinete eléctrico",
})

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="vehicle-form-container">
      {/* Título con animación de escritura que desaparece */}
      {showTitle && (
        <h2 className={`form-title ${formTitle.length === fullTitle.length ? "complete" : ""}`}>
          {formTitle}
          <span className={`cursor ${formTitle.length === fullTitle.length ? "blink" : ""}`}></span>
        </h2>
      )}

      {showForm && (
        <form className="vehicle-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brand">Marca del patinete:</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Selecciona una marca</option>
              {electricScooterBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="model">Modelo:</label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              required
              className="form-input"
              placeholder="Ej: Mi Pro 2"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="batteryRange">Autonomía:</label>
            <select
              id="batteryRange"
              value={batteryRange}
              onChange={(e) => setBatteryRange(e.target.value)}
              required
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Selecciona la autonomía</option>
              {batteryRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Continuar"}
          </button>
        </form>
      )}
    </div>
  )
}

export default ElectricScooterForm
