

import axios from "axios"
import OpenAI from "openai"

const openai = new OpenAI({
  apiKey: "dummy", // Replit integration handles this
  baseURL: "/api/ai", // Proxy to Replit AI integration or local server
  dangerouslyAllowBrowser: true
})

export const iniciarDiagnostico = async (datosVehiculo) => {
  try {
    const prompt = `Actúa como un experto mecánico automotriz. 
    Vehículo: ${JSON.stringify(datosVehiculo)}
    Problema descrito: ${datosVehiculo.problema}
    
    Analiza la situación y responde en formato JSON:
    {
      "pregunta": "Tu siguiente pregunta para profundizar en el diagnóstico",
      "es_ultima": false
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
    
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error("Error en iniciarDiagnostico:", error)
    throw error
  }
}

export const continuarDiagnostico = async (historial, vehicleData) => {
  try {
    const prompt = `Continúa el diagnóstico mecánico.
    Vehículo: ${JSON.stringify(vehicleData)}
    Historial: ${JSON.stringify(historial)}
    
    Si tienes suficiente información, responde con el diagnóstico final.
    Formato JSON:
    {
      "pregunta": "Siguiente pregunta si es necesario",
      "es_ultima": true/false,
      "diagnostico_y_soluciones": "Diagnóstico detallado y pasos a seguir si es_ultima es true"
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
    
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error("Error en continuarDiagnostico:", error)
    throw error
  }
}

export const interpretarCodigos = async (codigos) => {
  try {
    const prompt = `Interpreta los siguientes códigos de error OBD2: ${codigos.join(", ")}
    Responde en JSON:
    {
      "diagnostico": "Explicación de los códigos",
      "sugerencias": ["Sugerencia 1", "Sugerencia 2"]
    }`

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
    
    return JSON.parse(response.choices[0].message.content)
  } catch (error) {
    console.error("Error al interpretar códigos:", error)
    throw error
  }
}
