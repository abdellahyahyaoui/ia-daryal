"use client"

import { useState, useEffect } from "react"

const electricMotorcycleBrands = [
  "Zero",
  "Energica",
  "Harley-Davidson",
  "LiveWire",
  "Super Soco",
  "NIU",
  "Cake",
  "Vespa",
  "BMW",
  "KTM",
  "Husqvarna",
  "Silence",
  "Horwin",
  "Damon",
  "Lightning",
  "Gogoro",
  "Verge",
  "Arc",
  "Tarform",
  "Evoke",
  "Pursang",
  "Stark",
  "Rieju",
  "Bultaco",
  "Seat Mó",
]

// const motorcycleTypes = [
//   "Deportiva",
//   "Naked",
//   "Trail/Adventure",
//   "Custom/Cruiser",
//   "Scooter",
//   "Touring",
//   "Enduro",
//   "Supermotard",
//   "Café Racer",
//   "Urbana",
// ]

const batteryRanges = ["Menos de 50 km", "50-100 km", "100-150 km", "150-200 km", "Más de 200 km"]

function ElectricMotorcycleForm({ onSubmit }) {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [batteryRange, setBatteryRange] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Estado para el efecto de escritura del título
  const [formTitle, setFormTitle] = useState("")
  const [showTitle, setShowTitle] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const fullTitle = "Rellana el formulario"

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
  año: year,
  kilometraje: mileage,
  tipo_vehiculo: "moto",
})

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="electric-motorcycle-form-container">
      {/* Título con animación de escritura que desaparece */}
      {showTitle && (
        <h2 className={`form-title ${formTitle.length === fullTitle.length ? "complete" : ""}`}>
          {formTitle}
          <span className={`cursor ${formTitle.length === fullTitle.length ? "blink" : ""}`}></span>
        </h2>
      )}

      {showForm && (
        <form className="electric-motorcycle-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brand">Marca de la moto:</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Selecciona una marca</option>
              {electricMotorcycleBrands.map((brand) => (
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
              placeholder="Ej: SR/F"
              disabled={isLoading}
            />
          </div>

          {/* <div className="form-group">
            <label htmlFor="motorcycleType">Tipo de moto:</label>
            <select
              id="motorcycleType"
              value={motorcycleType}
              onChange={(e) => setMotorcycleType(e.target.value)}
              required
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Selecciona el tipo</option>
              {motorcycleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div> */}

          <div className="form-group">
            <label htmlFor="year">Año:</label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              min="2000"
              max={new Date().getFullYear()}
              className="form-input"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="mileage">Kilómetros:</label>
            <input
              type="number"
              id="mileage"
              value={mileage}
              onChange={(e) => setMileage(e.target.value)}
              required
              min="0"
              className="form-input"
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

export default ElectricMotorcycleForm
