

import axios from "axios"

const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
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

export const enviarMediaAIA = async (mediaAttachments, context) => {
  try {
    const formData = new FormData()
    
    // Add context data
    formData.append("problema", context.problema)
    formData.append("vehicleType", context.vehicleType)

    // Add media files
    for (let i = 0; i < mediaAttachments.length; i++) {
      const attachment = mediaAttachments[i]
      // In a real browser/app, we'd fetch the blob from the URL if not already present
      if (attachment.file) {
        formData.append(`file_${i}`, attachment.file)
      } else if (attachment.url) {
        const response = await fetch(attachment.url)
        const blob = await response.blob()
        formData.append(`file_${i}`, blob, `media_${i}.${attachment.type === "audio" ? "webm" : "jpg"}`)
      }
    }

    const response = await apiClient.post("/analizar-media", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    return response.data
  } catch (error) {
    console.error("Error en enviarMediaAIA:", error)
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
