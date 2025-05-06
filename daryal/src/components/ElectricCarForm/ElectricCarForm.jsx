"use client"

import { useState, useEffect } from "react"
import "./ElectricCarForm.scss"

const electricCarBrands = [
  "Tesla",
  "Nissan",
  "BMW",
  "Volkswagen",
  "Hyundai",
  "Kia",
  "Audi",
  "Mercedes-Benz",
  "Porsche",
  "Jaguar",
  "Renault",
  "Peugeot",
  "Chevrolet",
  "Ford",
  "Honda",
  "Toyota",
  "Volvo",
  "Rivian",
  "Lucid",
  "BYD",
  "NIO",
  "Xpeng",
  "Polestar",
  "CUPRA",
  "Skoda",
  "SEAT",
  "MG",
  "Fiat",
  "Mini",
  "Opel",
]

const batteryRanges = ["Menos de 200 km", "200-300 km", "300-400 km", "400-500 km", "Más de 500 km"]

function ElectricCarForm({ onSubmit }) {
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
        autonomia: batteryRange,
        tipo_vehiculo: "coche eléctrico", // Identificador para el backend
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="electric-car-form-container">
      {/* Título con animación de escritura que desaparece */}
      {showTitle && (
        <h2 className={`form-title ${formTitle.length === fullTitle.length ? "complete" : ""}`}>
          {formTitle}
          <span className={`cursor ${formTitle.length === fullTitle.length ? "blink" : ""}`}></span>
        </h2>
      )}

      {showForm && (
        <form className="electric-car-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="brand">Marca del coche:</label>
            <select
              id="brand"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              required
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Selecciona una marca</option>
              {electricCarBrands.map((brand) => (
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
              placeholder="Ej: Model 3"
              disabled={isLoading}
            />
          </div>

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
            {isLoading ? "Interpretando..." : "Continuar"}
          </button>
        </form>
      )}
    </div>
  )
}

export default ElectricCarForm
