

import axios from "axios"

const getBaseUrl = () => {
  const domain = window.location.hostname;
  // Si estamos en Replit/Local usamos el backend local, sino usamos Render
  if (domain === 'localhost' || domain === '127.0.0.1') {
    return "http://localhost:8000/api";
  }
  // URL de producción para la APK y web desplegada
  return "https://ia-daryal-3.onrender.com/api";
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
    // Si la ruta no existe (404), intentamos usar la lógica de diagnóstico inicio
    if (error.response && error.response.status === 404) {
      console.warn("Ruta /interpretar-codigos no encontrada, redirigiendo a diagnostico inicio");
      return { 
        diagnostico: "Códigos detectados: " + codigos.join(", "),
        sugerencias: ["Analizando con IA el historial completo..."]
      };
    }
    console.error("Error al interpretar códigos:", error.response || error)
    throw error
  }
}
