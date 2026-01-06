"use client"

import { useReducer, useEffect } from "react"
import ElectricCarForm from "./ElectricCarForm"
import OBDStatus from "../OBDStatus/OBDStatus"
import Diagnosis from "../Diagnosis/Diagnosis"
import { iniciarDiagnostico, continuarDiagnostico } from "../../api/openai"
import { useWelcomeState } from "../../hooks/useWelcomeState"
import ChatLayout from "../layout/ChatLayout"

const initialState = {
  step: "initial",
  vehicleData: null,
  currentQuestion: "",
  questionCount: 0,
  historial: [],
  diagnosis: "",
  isLastQuestion: false,
}

const diagnosisReducer = (state, action) => {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.payload }
    case "SET_VEHICLE_DATA":
      return { ...state, vehicleData: action.payload }
    case "SET_QUESTION":
      return {
        ...state,
        currentQuestion: action.payload,
        questionCount: state.questionCount + 1,
        isLastQuestion: false,
      }
    case "ADD_TO_HISTORIAL":
      return { ...state, historial: [...state.historial, ...action.payload] }
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload, step: "diagnosis" }
    case "SET_LAST_QUESTION":
      return { ...state, isLastQuestion: true }
    default:
      return state
  }
}

function ElectricCarDiagnosis() {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState)
  const { hasSeenWelcome, markWelcomeSeen, isLoading } = useWelcomeState()

  useEffect(() => {
    if (!isLoading) {
      dispatch({
        type: "SET_STEP",
        payload: hasSeenWelcome ? "vehicleForm" : "welcome",
      })
    }
  }, [hasSeenWelcome, isLoading])

  const handleManualSelection = () => {
    dispatch({ type: "SET_STEP", payload: "vehicleForm" })
  }

  const handleOBDSelection = () => {
    dispatch({ type: "SET_STEP", payload: "obd" })
  }

  const handleVehicleSubmit = async (data) => {
    dispatch({ type: "SET_VEHICLE_DATA", payload: data })
    dispatch({ type: "SET_STEP", payload: "chat" })
    dispatch({
      type: "SET_QUESTION",
      payload: "¿Qué problema has notado en tu coche eléctrico? Describe los síntomas para iniciar el diagnóstico.",
    })
  }

  const handleChatSubmit = async (message) => {
    try {
      const newUserMessage = { tipo: "respuesta", texto: message }
      const updatedHistorial = [...state.historial, newUserMessage]
      
      dispatch({
        type: "ADD_TO_HISTORIAL",
        payload: [newUserMessage],
      })

      if (state.historial.length === 0) {
        const vehicleDataWithProblem = {
          ...state.vehicleData,
          problema: message,
        }

        const response = await iniciarDiagnostico(vehicleDataWithProblem)

        if (response.pregunta) {
          dispatch({ type: "SET_QUESTION", payload: response.pregunta })
          dispatch({
            type: "ADD_TO_HISTORIAL",
            payload: [{ tipo: "pregunta", texto: response.pregunta }],
          })
        }
      } else {
        const response = await continuarDiagnostico(updatedHistorial, state.vehicleData)
        if (response.pregunta) {
          dispatch({ type: "SET_QUESTION", payload: response.pregunta })
          dispatch({
            type: "ADD_TO_HISTORIAL",
            payload: [{ tipo: "pregunta", texto: response.pregunta }],
          })
          if (response.es_ultima) dispatch({ type: "SET_LAST_QUESTION" })
        } else if (response.diagnostico_y_soluciones) {
          dispatch({
            type: "SET_DIAGNOSIS",
            payload: response.diagnostico_y_soluciones,
          })
        }
      }
    } catch (error) {
      console.error("Error en el proceso de diagnóstico:", error)
    }
  }

  const renderComponent = (type) => {
    switch (type) {
      case "vehicleForm":
        return <ElectricCarForm onSubmit={handleVehicleSubmit} />
      case "obd":
        return (
          <OBDStatus onClose={(data) => {
            if (data?.status === 'connected') {
              dispatch({ type: "SET_VEHICLE_DATA", payload: data })
              dispatch({ type: "SET_STEP", payload: "chat" })
            }
          }} />
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

  if (isLoading || state.step === "initial") {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="electric-car-diagnosis">
      {state.step === "welcome" && (
        <div className="selection-screen">
          <button onClick={handleManualSelection} className="selection-btn">Manual</button>
          <button onClick={handleOBDSelection} className="selection-btn">OBD2</button>
        </div>
      )}
      {(state.step === "obd" || state.step === "vehicleForm" || state.step === "chat" || state.step === "diagnosis") && (
        <ChatLayout
          messages={state.historial.map(h => ({
            sender: h.sender || (h.tipo === "respuesta" || h.tipo === "problema" ? "user" : "ai"),
            text: h.texto
          }))
          .concat(state.step === "obd" ? [{ sender: "ai", text: "Conectando al dispositivo OBD2...", component: "obd" }] : [])
          .concat(state.step === "vehicleForm" ? [{ sender: "ai", text: "Por favor, completa los datos del coche eléctrico.", component: "vehicleForm" }] : [])
          .concat(state.currentQuestion ? [{ sender: "ai", text: state.currentQuestion }] : [])
          .concat(state.diagnosis ? [{ sender: "ai", text: "He terminado mi análisis.", component: "diagnosis" }] : [])}
          onSendMessage={handleChatSubmit}
          isTyping={false}
          renderComponent={renderComponent}
        />
      )}
    </div>
  )
}

export default ElectricCarDiagnosis
