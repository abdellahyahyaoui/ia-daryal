"use client"

import { useState, useEffect } from "react"

const carBrands = [
  "Abarth","Alfa Romeo","Aston Martin","Audi","Bentley","BMW","Bugatti",
  "Cadillac","Chevrolet","Chrysler","Citroën","Dacia","Dodge","Ferrari",
  "Fiat","Ford","Honda","Hyundai","Infiniti","Jaguar","Jeep","Kia",
  "Lamborghini","Lancia","Land Rover","Lexus","Lotus","Maserati","Mazda",
  "McLaren","Mercedes-Benz","Mini","Mitsubishi","Nissan","Opel","Peugeot",
  "Porsche","Renault","Rolls-Royce","Seat","Škoda","Smart","Subaru",
  "Suzuki","Tesla","Toyota","Volkswagen","Volvo"
]

const fuelTypes = ["Gasolina","Diésel","Eléctrico","Híbrido","Gas Natural","GLP"]

function VehicleForm({ onSubmit }) {
  const [brand, setBrand] = useState("")
  const [brandOpen, setBrandOpen] = useState(false)

  const [fuelType, setFuelType] = useState("")
  const [fuelOpen, setFuelOpen] = useState(false)

  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const close = () => {
      setBrandOpen(false)
      setFuelOpen(false)
    }
    window.addEventListener("click", close)
    return () => window.removeEventListener("click", close)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit({
        marca: brand,
        modelo: model,
        año: year,
        kilometraje: mileage,
        combustible: fuelType,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="vehicle-form-container">
      <form className="vehicle-form" onSubmit={handleSubmit}>

        {/* MARCA */}
        <div className="form-group">
          <label>Marca del coche:</label>
          <div
            className="dropdown-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`dropdown-trigger ${brandOpen ? "open" : ""}`}
              onClick={() => {
                setBrandOpen(!brandOpen)
                setFuelOpen(false)
              }}
              disabled={isLoading}
            >
              {brand || "Selecciona una marca"}
              <span className="dropdown-icon">+</span>
            </button>

            {brandOpen && (
              <div className="dropdown-menu">
                {carBrands.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="dropdown-item"
                    onClick={() => {
                      setBrand(item)
                      setBrandOpen(false)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MODELO */}
        <div className="form-group">
          <label>Modelo:</label>
          <input
            type="text"
            className="form-input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            required
          />
        </div>

        {/* AÑO */}
        <div className="form-group">
          <label>Año:</label>
          <input
            type="number"
            className="form-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            required
          />
        </div>

        {/* KILÓMETROS */}
        <div className="form-group">
          <label>Kilómetros:</label>
          <input
            type="number"
            className="form-input"
            value={mileage}
            onChange={(e) => setMileage(e.target.value)}
            required
          />
        </div>

        {/* COMBUSTIBLE */}
        <div className="form-group">
          <label>Combustible:</label>
          <div
            className="dropdown-container"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className={`dropdown-trigger ${fuelOpen ? "open" : ""}`}
              onClick={() => {
                setFuelOpen(!fuelOpen)
                setBrandOpen(false)
              }}
              disabled={isLoading}
            >
              {fuelType || "Selecciona combustible"}
              <span className="dropdown-icon">+</span>
            </button>

            {fuelOpen && (
              <div className="dropdown-menu">
                {fuelTypes.map((item) => (
                  <button
                    type="button"
                    key={item}
                    className="dropdown-item"
                    onClick={() => {
                      setFuelType(item)
                      setFuelOpen(false)
                    }}
                  >
                    {item}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Continuar"}
        </button>
      </form>
    </div>
  )
}

export default VehicleForm
