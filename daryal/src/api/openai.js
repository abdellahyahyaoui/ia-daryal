

import axios from "axios"

const getBaseUrl = () => {
  const domain = window.location.hostname;
  if (domain === 'localhost' || domain === '127.0.0.1') {
    return "http://localhost:8000/api";
  }
  // In Replit, use the absolute path for the API
  return "/api";
}

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
})

export const iniciarDiagnostico = async (datosVehiculo) => {
  try {
    const response = await apiClient.post("/diagnostico/inicio", datosVehiculo)
    return response.data
  } catch (error) {
    console.error("Error detallado:", error.response || error)
    throw error
  }
}

export const continuarDiagnostico = async (historial, vehicleData) => {
  try {
    const response = await apiClient.post("/diagnostico/continuar", {
      historial,
      vehicleData,
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
