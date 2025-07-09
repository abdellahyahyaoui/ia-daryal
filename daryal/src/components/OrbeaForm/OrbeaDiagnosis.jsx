"use client"

import { useReducer, useEffect } from "react"
import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
import OrbeaForm from "./OrbeaForm"
import ChatInterface from "../ChatInterface/ChatInterface"
import Diagnosis from "../Diagnosis/Diagnosis"
import { iniciarDiagnostico, continuarDiagnostico } from "../../api/openai"
import { useWelcomeState } from "../../hooks/useWelcomeState"
import "./OrbeaForm.scss"
import "./OrbeaDiagnosis.scss"

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

function OrbeaDiagnosis() {
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
      // Si es el primer mensaje, es la descripción del problema
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
          alert("Ocurrió un error al continuar el diagnóstico. Intenta nuevamente.")
        }
      }
    } catch (error) {
      console.error("Error en el proceso de diagnóstico:", error)
      alert("Ocurrió un error en el proceso de diagnóstico. Intenta nuevamente.")
    }
  }

  if (isLoading || state.step === "initial") {
    return <div className="loading">Cargando...</div>
  }

  return (
    <div className="orbea-diagnosis">
      {state.step === "welcome" && <WelcomeDialog onStart={handleStartDiagnosis} />}
      {state.step === "vehicleForm" && <OrbeaForm onSubmit={handleVehicleSubmit} />}
      {state.step === "chat" && (
        <>
          <div className="diagnosis-header">
            <h2>Vamos a diagnosticar tu Orbea E-Bike</h2>
            <div className="vehicle-info">
              {state.vehicleData && (
                <span>
                  {state.vehicleData.marca} {state.vehicleData.modelo} ({state.vehicleData.año}) -{" "}
                  {state.vehicleData.categoria}
                </span>
              )}
            </div>
          </div>
          <ChatInterface
            vehicleData={state.vehicleData}
            onSubmit={handleChatSubmit}
            currentQuestion={state.currentQuestion}
            isProcessing={false}
            errorMode={false}
          />
        </>
      )}
      {state.step === "diagnosis" && <Diagnosis diagnosis={state.diagnosis} />}
    </div>
  )
}

export default OrbeaDiagnosis
