

import axios from "axios"

const apiClient = axios.create({
  baseURL: "https://ia-daryal-3.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000, // Aumentado a 60s por si Render está arrancando
})

export const iniciarDiagnostico = async (datosVehiculo) => {
  try {
    const response = await apiClient.post("/iniciar-diagnostico", datosVehiculo)
    return response.data
  } catch (error) {
    console.error("Error en iniciarDiagnostico:", error)
    throw error
  }
}

export const continuarDiagnostico = async (historial, vehicleData) => {
  try {
    const response = await apiClient.post("/continuar-diagnostico", {
      historial,
      vehiculo: vehicleData,
    })
    return response.data
  } catch (error) {
    console.error("Error en continuarDiagnostico:", error)
    throw error
  }
}

export const interpretarCodigos = async (codigos) => {
  try {
    const response = await apiClient.post("/interpretar-codigos", { codigos })
    return response.data
  } catch (error) {
    console.error("Error al interpretar códigos:", error)
    throw error
  }
}
