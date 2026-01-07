"use client"

import { useState } from "react"

const carBrands = [
  "Abarth", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Bugatti",
  "Cadillac", "Chevrolet", "Chrysler", "Citroën", "Dacia", "Dodge", "Ferrari",
  "Fiat", "Ford", "Honda", "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia",
  "Lamborghini", "Lancia", "Land Rover", "Lexus", "Lotus", "Maserati", "Mazda",
  "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", "Opel", "Peugeot",
  "Porsche", "Renault", "Rolls-Royce", "Seat", "Škoda", "Smart", "Subaru",
  "Suzuki", "Tesla", "Toyota", "Volkswagen", "Volvo",
]

const fuelTypes = ["Gasolina", "Diésel", "Eléctrico", "Híbrido", "Gas Natural", "GLP"]

function VehicleForm({ onSubmit }) {
  const [brand, setBrand] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [mileage, setMileage] = useState("")
  const [fuelType, setFuelType] = useState("")
  const [isLoading, setIsLoading] = useState(false)

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
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="vehicle-form-container">
      <form className="vehicle-form" onSubmit={handleSubmit}>
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
            {carBrands.map((brand) => (
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
            placeholder="Ej: Corolla 2.0"
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

        <div className="form-group">
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
        </div>

        <button type="submit" className="submit-button" disabled={isLoading}>
          {isLoading ? "Procesando..." : "Continuar"}
        </button>
      </form>
    </div>
  )
}

export default VehicleForm
