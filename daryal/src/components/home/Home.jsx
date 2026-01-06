// "use client"

// // Solo incluyo las partes relevantes que necesitas modificar
// // Elimina la lógica de mover el robot, ya que no es necesaria

// import { useReducer } from "react"
// import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
// import VehicleForm from "../VehicleForm/VehicleForm"
// import QuestionForm from "../QuestionForm/QuestionForm"
// import Diagnosis from "../Diagnosis/Diagnosis"
// import { iniciarDiagnostico, continuarDiagnostico } from "../../api/openai"
// import "./Home.scss"

// const initialState = {
//   step: "welcome",
//   vehicleData: null,
//   currentQuestion: "",
//   questionCount: 0,
//   historial: [],
//   diagnosis: "",
//   isLastQuestion: false,
// }

// const diagnosisReducer = (state, action) => {
//   switch (action.type) {
//     case "SET_STEP":
//       return { ...state, step: action.payload }
//     case "SET_VEHICLE_DATA":
//       return { ...state, vehicleData: action.payload }
//     case "SET_QUESTION":
//       return {
//         ...state,
//         currentQuestion: action.payload,
//         questionCount: state.questionCount + 1,
//         isLastQuestion: false,
//       }
//     case "ADD_TO_HISTORIAL":
//       return { ...state, historial: [...state.historial, ...action.payload] }
//     case "SET_DIAGNOSIS":
//       return { ...state, diagnosis: action.payload, step: "diagnosis" }
//     case "SET_LAST_QUESTION":
//       return { ...state, isLastQuestion: true }
//     default:
//       return state
//   }
// }

// function Home() {
//   const [state, dispatch] = useReducer(diagnosisReducer, initialState)

//   const handleStartDiagnosis = () => {
//     dispatch({ type: "SET_STEP", payload: "vehicleForm" })
//   }

//   const handleVehicleSubmit = async (data) => {
//     dispatch({ type: "SET_VEHICLE_DATA", payload: data })
//     try {
//       const response = await iniciarDiagnostico(data)
//       dispatch({ type: "SET_QUESTION", payload: response.pregunta })
//       dispatch({
//         type: "ADD_TO_HISTORIAL",
//         payload: [{ tipo: "problema", texto: data.problema }],
//       })
//       dispatch({ type: "SET_STEP", payload: "questions" })
//     } catch (error) {
//       console.error("Error al iniciar el diagnóstico:", error)
//       alert("Ocurrió un error al iniciar el diagnóstico. Intenta nuevamente.")
//     }
//   }

//   const handleQuestionSubmit = async (answer) => {
//     dispatch({
//       type: "ADD_TO_HISTORIAL",
//       payload: [
//         { tipo: "pregunta", texto: state.currentQuestion },
//         { tipo: "respuesta", texto: answer },
//       ],
//     })

//     try {
//       const response = await continuarDiagnostico(state.historial, state.vehicleData)
//       if (response.pregunta) {
//         dispatch({ type: "SET_QUESTION", payload: response.pregunta })
//         if (response.es_ultima) dispatch({ type: "SET_LAST_QUESTION" })
//       } else if (response.diagnostico_y_soluciones) {
//         dispatch({
//           type: "SET_DIAGNOSIS",
//           payload: response.diagnostico_y_soluciones,
//         })
//       }
//     } catch (error) {
//       console.error("Error al continuar el diagnóstico:", error)
//       alert("Ocurrió un error al continuar el diagnóstico. Intenta nuevamente.")
//     }
//   }

//   return (
//     <div className="home">
//       {state.step === "welcome" && <WelcomeDialog onStart={handleStartDiagnosis} />}
//       {state.step === "vehicleForm" && <VehicleForm onSubmit={handleVehicleSubmit} />}
//       {state.step === "questions" && (
//         <QuestionForm
//           question={state.currentQuestion}
//           onSubmit={handleQuestionSubmit}
//           questionNumber={state.questionCount + 1}
//           maxQuestions={5}
//           isLastQuestion={state.isLastQuestion}
//         />
//       )}
//       {state.step === "diagnosis" && <Diagnosis diagnosis={state.diagnosis} />}
//     </div>
//   )
// }

// export default Home



import { useReducer, useState, useEffect } from "react"
import axios from "axios"
import ChatLayout from "../layout/ChatLayout"
import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
import VehicleForm from "../VehicleForm/VehicleForm"
import Diagnosis from "../Diagnosis/Diagnosis"
import OBDStatus from "../OBDStatus/OBDStatus"
import TechnicalSheetUpload from "../ManualUpload/ManualUpload"
import { iniciarDiagnostico, continuarDiagnostico } from "../../api/openai"
import "./Home.scss"

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
        const formData = new FormData()
        formData.append('file', imageFile)
        const domain = window.location.hostname
        const apiUrl = domain === 'localhost' ? 'http://localhost:8000' : ''
        const visionResponse = await axios.post(`${apiUrl}/api/vision/analizar`, formData)
        finalMessage = `[Imagen: ${visionResponse.data.analysis}] ${message}`
      }

      if (state.historial.length === 0) {
        dispatch({ type: "ADD_TO_HISTORIAL", payload: [{ tipo: "problema", texto: finalMessage }] })
        const response = await iniciarDiagnostico({ ...state.vehicleData, problema: finalMessage })
        dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: response.pregunta } })
        dispatch({ type: "SET_QUESTION", payload: response.pregunta, isLastQuestion: response.es_ultima })
      } else {
        dispatch({ type: "ADD_TO_HISTORIAL", payload: [{ tipo: "respuesta", texto: finalMessage }] })
        const response = await continuarDiagnostico([...state.historial, { tipo: "respuesta", texto: finalMessage }], state.vehicleData)
        
        if (response.pregunta) {
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: response.pregunta } })
          dispatch({ type: "SET_QUESTION", payload: response.pregunta, isLastQuestion: response.es_ultima })
        } else if (response.diagnostico_y_soluciones) {
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "He terminado mi análisis.", component: "diagnosis" } })
          dispatch({ type: "SET_DIAGNOSIS", payload: response.diagnostico_y_soluciones })
        }
      }
    } catch (error) {
      dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Lo siento, tuve un error procesando tu mensaje." } })
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
        return <VehicleForm onSubmit={(data) => {
          dispatch({ type: "SET_VEHICLE_DATA", payload: data })
          dispatch({ type: "SET_STEP", payload: "chat" })
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "¿Qué problema tiene tu vehículo?" } })
        }} />
      case "obd":
        return <OBDStatus onClose={(data) => {
          if (data?.status === 'connected') {
            dispatch({ type: "SET_VEHICLE_DATA", payload: data })
            dispatch({ type: "SET_STEP", payload: "chat" })
            dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "OBD Conectado. ¿Qué problema has notado?" } })
          }
        }} />
      case "manual":
        return <TechnicalSheetUpload onExtractionSuccess={(specs) => {
          dispatch({ type: "SET_VEHICLE_DATA", payload: specs })
          dispatch({ type: "SET_STEP", payload: "chat" })
          dispatch({ type: "ADD_MESSAGE", payload: { sender: "ai", text: "Ficha procesada. Describe el problema." } })
        }} onClose={() => {}} />
      case "diagnosis":
        return <Diagnosis diagnosis={state.diagnosis} />
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
