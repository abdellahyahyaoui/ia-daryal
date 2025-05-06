

import axios from "axios"

const API_URL =
  process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "https://ia-daryal-3.onrender.com/api"

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
})

export const iniciarDiagnostico = async (datosVehiculo) => {
  try {
    const response = await apiClient.post("/iniciar-diagnostico", datosVehiculo)
    return response.data
  } catch (error) {
    console.error("Error detallado:", error.response || error)
    throw error
  }
}

export const continuarDiagnostico = async (historial, vehicleData) => {
  try {
    // Renombrar vehicleData a vehiculo para que coincida con lo que espera la API
    const response = await apiClient.post("/continuar-diagnostico", {
      historial,
      vehiculo: vehicleData,
    })
    return response.data
  } catch (error) {
    console.error("Error detallado:", error.response || error)
    throw error
  }
}

export const interpretarCodigos = async (codigos) => {
  try {
    const response = await apiClient.post("/interpretar-codigos", { codigos })
    return response.data
  } catch (error) {
    console.error("Error al interpretar códigos:", error.response || error)
    throw error
  }
}
