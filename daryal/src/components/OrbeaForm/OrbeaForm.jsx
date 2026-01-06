"use client"

import { useState } from "react"

const orbeaModels = {
  Carretera: ["Gain D30", "Gain D40", "Gain D50", "Gain M30", "Gain M20", "Gain M10"],
  "Montaña/MTB": [
    "Wild FS M-Team",
    "Wild FS M10",
    "Wild FS M20",
    "Wild FS H30",
    "Wild FS H25",
    "Wild FS H20",
    "Wild FS H10",
    "Rise M-Team",
    "Rise M10",
    "Rise M20",
    "Rise H30",
    "Rise H20",
    "Rise H15",
    "Rise H10",
    "Alma M50",
    "Alma M30",
    "Alma M25",
    "Occam M30",
    "Occam M20",
    "Occam M10",
    "Rallon M-Team",
    "Rallon M10",
    "Rallon M20",
  ],
  "Urbana/City": [
    "Kemen Comfort 10",
    "Kemen Comfort 20",
    "Kemen Comfort 30",
    "Kemen Speed 10",
    "Kemen Speed 20",
    "Kemen Speed 30",
    "Urrun 10",
    "Urrun 20",
    "Urrun 30",
    "Vibe H10",
    "Vibe H30",
    "Vibe Mid H10",
    "Vibe Mid H30",
    "Optima A10",
    "Optima A20",
    "Optima A30",
    "Optima E40",
    "Optima E50",
    "Katu 10",
    "Katu 20",
    "Katu 30",
  ],
  Gravel: ["Terra M30", "Terra M20", "Terra M10", "Gain D31", "Gain D41"],
  Trekking: [
    "Kemen Comfort 10 EQ",
    "Kemen Comfort 20 EQ",
    "Kemen Comfort 30 EQ",
    "Urrun 10 EQ",
    "Urrun 20 EQ",
    "Urrun 30 EQ",
  ],
}

const batteryTypes = [
  "Bosch PowerTube 500Wh",
  "Bosch PowerTube 625Wh",
  "Bosch PowerPack 400Wh",
  "Bosch PowerPack 500Wh",
  "Shimano Steps E8000",
  "Shimano Steps E7000",
  "Shimano Steps E6100",
  "Ebikemotion X35",
  "Mahle X20",
  "Otro",
]

const motorTypes = [
  "Bosch Performance Line CX",
  "Bosch Performance Line",
  "Bosch Active Line Plus",
  "Shimano Steps E8000",
  "Shimano Steps E7000",
  "Shimano Steps E6100",
  "Ebikemotion X35",
  "Mahle X20",
  "Otro",
]

function OrbeaForm({ onSubmit }) {
  const [category, setCategory] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [batteryType, setBatteryType] = useState("")
  const [motorType, setMotorType] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleCategoryChange = (e) => {
    setCategory(e.target.value)
    setModel("") // Reset model when category changes
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)

    try {
      await onSubmit({
        marca: "Orbea",
        categoria: category,
        modelo: model,
        año: year,
        kilometraje: mileage,
        tipo_bateria: batteryType,
        tipo_motor: motorType,
        tipo_vehiculo: "bicicleta eléctrica Orbea", // Identificador para el backend
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="vehicle-form-container">
      <h2 className="form-title">Diagnóstico Orbea E-Bike</h2>
      <form className="vehicle-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Categoría:</label>
          <select
            id="category"
            value={category}
            onChange={handleCategoryChange}
            required
            className="form-select"
            disabled={isLoading}
          >
            <option value="">Selecciona una categoría</option>
            {Object.keys(orbeaModels).map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="model">Modelo:</label>
          <select
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
            className="form-select"
            disabled={isLoading || !category}
          >
            <option value="">Selecciona un modelo</option>
            {category &&
              orbeaModels[category].map((mod) => (
                <option key={mod} value={mod}>
                  {mod}
                </option>
              ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="year">Año:</label>
          <input
            type="number"
            id="year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
            min="2015"
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
          <label htmlFor="motorType">Tipo de motor:</label>
          <select
            id="motorType"
            value={motorType}
            onChange={(e) => setMotorType(e.target.value)}
            required
            className="form-select"
            disabled={isLoading}
          >
            <option value="">Selecciona el motor</option>
            {motorTypes.map((motor) => (
              <option key={motor} value={motor}>
                {motor}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="batteryType">Tipo de batería:</label>
          <select
            id="batteryType"
            value={batteryType}
            onChange={(e) => setBatteryType(e.target.value)}
            required
            className="form-select"
            disabled={isLoading}
          >
            <option value="">Selecciona la batería</option>
            {batteryTypes.map((battery) => (
              <option key={battery} value={battery}>
                {battery}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Continuar"}
        </button>
      </form>
    </div>
  )
}

export default OrbeaForm
