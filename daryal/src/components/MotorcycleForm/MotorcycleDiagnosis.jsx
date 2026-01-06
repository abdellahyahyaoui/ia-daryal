"use client"

import { useReducer, useEffect } from "react"
import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
import MotorcycleForm from "./MotorcycleForm"
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

function MotorcycleDiagnosis() {
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

  const handleStartDiagnosis = () => {
    markWelcomeSeen()
    dispatch({ type: "SET_STEP", payload: "vehicleForm" })
  }

  const handleVehicleSubmit = async (data) => {
    dispatch({ type: "SET_VEHICLE_DATA", payload: data })
    dispatch({ type: "SET_STEP", payload: "chat" })
  }

  const handleChatSubmit = async (message) => {
    try {
      if (state.historial.length === 0) {
        dispatch({
          type: "ADD_TO_HISTORIAL",
          payload: [{ tipo: "problema", texto: message }],
        })

        const vehicleDataWithProblem = {
          ...state.vehicleData,
          problema: message,
        }

        const response = await iniciarDiagnostico(vehicleDataWithProblem)

        if (response.pregunta) {
          dispatch({ type: "SET_QUESTION", payload: response.pregunta })
          if (response.es_ultima) dispatch({ type: "SET_LAST_QUESTION" })
        }
      } else {
        dispatch({
          type: "ADD_TO_HISTORIAL",
          payload: [
            { tipo: "pregunta", texto: state.currentQuestion },
            { tipo: "respuesta", texto: message },
          ],
        })

        try {
          const response = await continuarDiagnostico(state.historial, state.vehicleData)
          if (response.pregunta) {
            dispatch({ type: "SET_QUESTION", payload: response.pregunta })
            if (response.es_ultima) dispatch({ type: "SET_LAST_QUESTION" })
          } else if (response.diagnostico_y_soluciones) {
            dispatch({
              type: "SET_DIAGNOSIS",
              payload: response.diagnostico_y_soluciones,
            })
          }
        } catch (error) {
          console.error("Error al continuar el diagnóstico:", error)
        }
      }
    } catch (error) {
      console.error("Error en el proceso de diagnóstico:", error)
    }
  }

  const renderComponent = (type) => {
    switch (type) {
      case "vehicleForm":
        return <MotorcycleForm onSubmit={handleVehicleSubmit} />
      default:
        return null
    }
  }

  if (isLoading || state.step === "initial") {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="motorcycle-diagnosis">
      {state.step === "welcome" && <WelcomeDialog onStart={handleStartDiagnosis} />}
      {(state.step === "vehicleForm" || state.step === "chat" || state.step === "diagnosis") && (
        <ChatLayout
          messages={state.historial.map(h => ({
            sender: h.sender || (h.tipo === "respuesta" || h.tipo === "problema" ? "user" : "ai"),
            text: h.texto
          }))
          .concat(state.step === "vehicleForm" ? [{ sender: "ai", text: "Por favor, completa los datos de la moto.", component: "vehicleForm" }] : [])
          .concat(state.currentQuestion ? [{ sender: "ai", text: state.currentQuestion }] : [])
          .concat(state.diagnosis ? [{ sender: "ai", text: `**Diagnóstico Final:**\n\n${state.diagnosis}` }] : [])}
          onSendMessage={handleChatSubmit}
          isTyping={false}
          renderComponent={renderComponent}
        />
      )}
    </div>
  )
}

export default MotorcycleDiagnosis
