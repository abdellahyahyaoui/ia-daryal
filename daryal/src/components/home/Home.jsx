


import { useReducer, useState, useEffect } from "react"
import axios from "axios"
import ChatLayout from "../layout/ChatLayout"
import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
import VehicleForm from "../VehicleForm/VehicleForm"
import Diagnosis from "../Diagnosis/Diagnosis"
import OBDStatus from "../OBDStatus/OBDStatus"
import TechnicalSheetUpload from "../ManualUpload/ManualUpload"
import { iniciarDiagnostico, continuarDiagnostico } from "../../api/openai"

const initialState = {
  messages: [],
  step: "welcome", // welcome, vehicleForm, obd, manual, chat, diagnosis
  vehicleData: null,
  currentQuestion: "",
  questionCount: 0,
  historial: [],
  diagnosis: "",
  isLastQuestion: false,
}

const diagnosisReducer = (state, action) => {
  switch (action.type) {
    case "ADD_MESSAGE":
      return { ...state, messages: [...state.messages, action.payload] }
    case "SET_STEP":
      return { ...state, step: action.payload }
    case "SET_VEHICLE_DATA":
      return { ...state, vehicleData: action.payload }
    case "SET_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        questionCount: state.questionCount + 1,
        isLastQuestion: action.isLastQuestion || false,
      }
    case "ADD_TO_HISTORIAL":
      return { ...state, historial: [...state.historial, ...action.payload] }
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload, step: "diagnosis" }
    default:
      return state
  }
}

function Home() {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState)
  const [isTyping, setIsTyping] = useState(false)

  // Welcome message
  useEffect(() => {
    if (state.messages.length === 0) {
      setIsTyping(true)
      setTimeout(() => {
        dispatch({
          type: "ADD_MESSAGE",
          payload: {
            sender: "ai",
            text: "¡Hola! Soy Daryal, tu experto en diagnóstico. ¿Cómo quieres empezar?",
            component: "welcome"
          }
        })
        setIsTyping(false)
      }, 1000)
    }
  }, [state.messages.length])

  const handleSendMessage = async (text, attachment) => {
    dispatch({ type: "ADD_MESSAGE", payload: { sender: "user", text } })
    
    // Process user input
    if (state.step === "chat") {
      setIsTyping(true)
      await processChatInput(text, attachment)
    }
  }

  const processChatInput = async (message, imageFile) => {
    try {
      let finalMessage = message
      if (imageFile) {
        // En un entorno Capacitor real, aquí procesaríamos la imagen localmente o la subiríamos
        // Para la web, simulamos el análisis si no hay un backend de visión configurado
        finalMessage = `[Imagen adjunta] ${message}`
      }

      if (state.historial.length === 0) {
        const payload = [{ tipo: "problema", texto: finalMessage }]
        dispatch({ type: "ADD_TO_HISTORIAL", payload })
        const response = await iniciarDiagnostico({ ...state.vehicleData, problema: finalMessage })
        
        if (response.pregunta) {
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: response.pregunta } })
          dispatch({ type: "SET_QUESTION", payload: response.pregunta, isLastQuestion: response.es_ultima })
        }
      } else {
        const payload = [{ tipo: "respuesta", texto: finalMessage }]
        dispatch({ type: "ADD_TO_HISTORIAL", payload })
        const fullHistorial = [...state.historial, ...payload]
        const response = await continuarDiagnostico(fullHistorial, state.vehicleData)
        
        if (response.pregunta) {
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: response.pregunta } })
          dispatch({ type: "SET_QUESTION", payload: response.pregunta, isLastQuestion: response.es_ultima })
        }
        
        if (response.diagnostico_y_soluciones) {
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "He terminado mi análisis.", component: "diagnosis" } })
          dispatch({ type: "SET_DIAGNOSIS", payload: response.diagnostico_y_soluciones })
        }
      }
    } catch (error) {
      dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Lo siento, tuve un error conectando con la IA." } })
    } finally {
      setIsTyping(false)
    }
  }

  const renderComponent = (type) => {
    switch(type) {
      case "welcome":
        return <WelcomeDialog 
          onStart={() => {
            dispatch({ type: "SET_STEP", payload: "vehicleForm" })
            dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Por favor, completa los datos del vehículo.", component: "vehicleForm" } })
          }}
          onOBDClick={() => {
            dispatch({ type: "SET_STEP", payload: "obd" })
            dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Conectando al dispositivo OBD2...", component: "obd" } })
          }}
          onManualClick={() => {
            dispatch({ type: "SET_STEP", payload: "manual" })
            dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Sube la ficha técnica.", component: "manual" } })
          }}
        />
      case "vehicleForm":
        return (
          <div className="vehicle-form-container">
            <VehicleForm onSubmit={(data) => {
              dispatch({ type: "SET_VEHICLE_DATA", payload: data })
              dispatch({ type: "SET_STEP", payload: "chat" })
              dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "¿Qué problema tiene tu vehículo?" } })
            }} />
          </div>
        )
      case "obd":
        return (
          <div className="vehicle-form-container">
            <OBDStatus onClose={(data) => {
              if (data?.status === 'connected') {
                dispatch({ type: "SET_VEHICLE_DATA", payload: data })
                dispatch({ type: "SET_STEP", payload: "chat" })
                dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "OBD Conectado. ¿Qué problema has notado?" } })
              }
            }} />
          </div>
        )
      case "manual":
        return (
          <div className="vehicle-form-container">
            <TechnicalSheetUpload onExtractionSuccess={(specs) => {
              dispatch({ type: "SET_VEHICLE_DATA", payload: specs })
              dispatch({ type: "SET_STEP", payload: "chat" })
              dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Ficha procesada. Describe el problema." } })
            }} onClose={() => {}} />
          </div>
        )
      case "diagnosis":
        return (
          <div className="vehicle-form-container">
            <Diagnosis diagnosis={state.diagnosis} />
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="home">
      <ChatLayout 
        messages={state.messages} 
        onSendMessage={handleSendMessage}
        isTyping={isTyping}
        renderComponent={renderComponent}
      />
    </div>
  )
}

export default Home
