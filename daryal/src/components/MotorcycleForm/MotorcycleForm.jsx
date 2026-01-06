"use client"

import { useState, useEffect } from "react"

const motorcycleBrands = [
  "Aprilia",
  "BMW",
  "Ducati",
  "Harley-Davidson",
  "Honda",
  "Husqvarna",
  "Kawasaki",
  "KTM",
  "Moto Guzzi",
  "MV Agusta",
  "Royal Enfield",
  "Suzuki",
  "Triumph",
  "Vespa",
  "Yamaha",
  "Benelli",
  "Bimota",
  "Buell",
  "CFMoto",
  "Daelim",
  "Derbi",
  "Gas Gas",
  "Hyosung",
  "Indian",
  "Keeway",
  "Kymco",
  "Mash",
  "Montesa",
  "Moto Morini",
  "Norton",
  "Piaggio",
  "Rieju",
  "SWM",
  "SYM",
  "Victory",
  "Zero",
]

// const motorcycleTypes = [
//   "Deportiva",
//   "Naked",
//   "Trail/Adventure",
//   "Custom/Cruiser",
//   "Scooter",
//   "Touring",
//   "Enduro",
//   "Motocross",
//   "Trial",
//   "Supermotard",
//   "Café Racer",
//   "Scrambler",
// ]

const fuelTypes = ["Gasolina", "Eléctrico"]

function MotorcycleForm({ onSubmit }) {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
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
        combustible: fuelType,
        tipo_moto: motorcycleType,
        tipo_vehiculo: "moto", // Identificador para el backend
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="motorcycle-form-container">
      {/* Título con animación de escritura que desaparece */}
      {showTitle && (
        <h2 className={`form-title ${formTitle.length === fullTitle.length ? "complete" : ""}`}>
          {formTitle}
          <span className={`cursor ${formTitle.length === fullTitle.length ? "blink" : ""}`}></span>
        </h2>
      )}

      {showForm && (
        <form className="motorcycle-form" onSubmit={handleSubmit}>
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
              {motorcycleBrands.map((brand) => (
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
              placeholder="Ej: CBR 600RR"
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
              min="1900"
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

          {/* <div className="form-group">
            <label htmlFor="fuelType">Combustible:</label>
            <select
              id="fuelType"
              value={fuelType}
              onChange={(e) => setFuelType(e.target.value)}
              required
              className="form-select"
              disabled={isLoading}
            >
              <option value="">Selecciona el combustible</option>
              {fuelTypes.map((fuel) => (
                <option key={fuel} value={fuel}>
                  {fuel}
                </option>
              ))}
            </select>
          </div> */}

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? "Procesando..." : "Continuar"}
          </button>
        </form>
      )}
    </div>
  )
}

export default MotorcycleForm
