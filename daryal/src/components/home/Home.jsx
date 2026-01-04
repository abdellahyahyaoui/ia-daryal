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



import { useReducer, useState } from "react"
import axios from "axios"
import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
import VehicleForm from "../VehicleForm/VehicleForm"
import ChatInterface from "../ChatInterface/ChatInterface"
import Diagnosis from "../Diagnosis/Diagnosis"
import OBDStatus from "../OBDStatus/OBDStatus"
import TechnicalSheetUpload from "../ManualUpload/ManualUpload"
import Header from "../Header/Header"
import { iniciarDiagnostico, continuarDiagnostico } from "../../api/openai"
import "./Home.scss"

const initialState = {
  step: "welcome",
  vehicleData: null,
  currentQuestion: "",
  questionCount: 0,
  historial: [],
  diagnosis: "",
  isLastQuestion: false,
  manualId: null,
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
        isLastQuestion: action.isLastQuestion || false,
      }
    case "ADD_TO_HISTORIAL":
      return { ...state, historial: [...state.historial, ...action.payload] }
    case "SET_DIAGNOSIS":
      return { ...state, diagnosis: action.payload, step: "diagnosis" }
    case "SET_MANUAL_ID":
      return { ...state, manualId: action.payload }
    default:
      return state
  }
}

function Home() {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showOBD, setShowOBD] = useState(false)
  const [showManual, setShowManual] = useState(false)
  const [currentOBDData, setCurrentOBDData] = useState(null)

  const [extractedSpecs, setExtractedSpecs] = useState("")

  const handleStartDiagnosis = () => {
    dispatch({ type: "SET_STEP", payload: "vehicleForm" })
  }

  const handleTechSheetSuccess = (specs) => {
    setExtractedSpecs(specs)
    setShowManual(false)
    // Si la ficha técnica tiene datos suficientes, podemos ir directo al chat
    if (specs && specs.marca && specs.modelo) {
      const autoData = {
        marca: specs.marca,
        modelo: specs.modelo,
        año: specs.año || "Desconocido",
        combustible: specs.combustible || "Desconocido",
        extracted_specs: specs
      }
      dispatch({ type: "SET_VEHICLE_DATA", payload: autoData })
      dispatch({ type: "SET_STEP", payload: "chat" })
    }
  }

  const handleOBDConnected = (data) => {
    setCurrentOBDData(data)
    setShowOBD(false)
    // Si el OBD nos da el VIN o datos del coche, saltamos el formulario
    if (data && data.status === 'connected') {
      const autoData = {
        marca: data.marca || "Identificado vía OBD",
        modelo: data.modelo || "Estandar OBD-II",
        año: data.año || "Auto-detectado",
        obd_data: data
      }
      dispatch({ type: "SET_VEHICLE_DATA", payload: autoData })
      dispatch({ type: "SET_STEP", payload: "chat" })
    }
  }

  const handleVehicleSubmit = async (data) => {
    // Si tenemos specs extraídas, las añadimos al vehículo
    const updatedData = { ...data, extracted_specs: extractedSpecs }
    dispatch({ type: "SET_VEHICLE_DATA", payload: updatedData })
    dispatch({ type: "SET_STEP", payload: "chat" })
  }

  const handleChatSubmit = async (message, imageFile = null) => {
    setIsProcessing(true)

    try {
      let finalMessage = message;
      if (imageFile) {
        const formData = new FormData();
        formData.append('file', imageFile);
        
        const domain = window.location.hostname;
        const apiUrl = domain === 'localhost' ? 'http://localhost:8000' : '';
        
        const visionResponse = await axios.post(`${apiUrl}/api/vision/analizar`, formData);
        finalMessage = `[Análisis de Imagen: ${visionResponse.data.analysis}]\n\n${message}`;
      }

      if (state.historial.length === 0) {
        dispatch({
          type: "ADD_TO_HISTORIAL",
          payload: [{ tipo: "problema", texto: finalMessage }],
        })

        const vehicleDataWithProblem = {
          ...state.vehicleData,
          problema: finalMessage,
          extracted_specs: extractedSpecs,
          obd_data: currentOBDData,
        }

        const response = await iniciarDiagnostico(vehicleDataWithProblem)

        if (response.pregunta) {
          dispatch({
            type: "SET_QUESTION",
            payload: response.pregunta,
            isLastQuestion: response.es_ultima || false,
          })
        }
      } else {
        dispatch({
          type: "ADD_TO_HISTORIAL",
          payload: [{ tipo: "respuesta", texto: finalMessage }],
        })

        try {
          const response = await continuarDiagnostico(
            [...state.historial, { tipo: "respuesta", texto: finalMessage }],
            state.vehicleData,
          )

          const esUltimaPregunta = state.questionCount >= 4

          if (response.pregunta && !esUltimaPregunta) {
            dispatch({
              type: "SET_QUESTION",
              payload: response.pregunta,
              isLastQuestion: response.es_ultima || esUltimaPregunta,
            })
          } else {
            const mensajeTransicion =
              "Gracias por tu información. He completado mi análisis y tengo un diagnóstico para ti."

            dispatch({
              type: "SET_QUESTION",
              payload: mensajeTransicion,
              isLastQuestion: true,
            })

            setTimeout(() => {
              const diagnostico = generarDiagnosticoBasadoEnHistorial(state.historial)
              dispatch({
                type: "SET_DIAGNOSIS",
                payload: diagnostico,
              })
            }, 3000)
          }
        } catch (error) {
          if (state.questionCount >= 4) {
            dispatch({
              type: "SET_QUESTION",
              payload: "Gracias por tu información. He completado mi análisis y tengo un diagnóstico para ti.",
              isLastQuestion: true,
            })

            setTimeout(() => {
              const diagnostico = generarDiagnosticoBasadoEnHistorial(state.historial)
              dispatch({
                type: "SET_DIAGNOSIS",
                payload: diagnostico,
              })
            }, 3000)
          } else {
            alert("Ocurrió un error en el proceso de diagnóstico. Intenta nuevamente.")
          }
        }
      }
    } catch (error) {
      alert("Ocurrió un error en el proceso de diagnóstico. Intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  const generarDiagnosticoBasadoEnHistorial = (historial) => {
    const todosLosTextos = historial.map((item) => item.texto.toLowerCase())
    const textoCompleto = todosLosTextos.join(" ")

    let diagnostico = ""
    let soluciones = []

    if (textoCompleto.includes("humo") || textoCompleto.includes("escape")) {
      if (textoCompleto.includes("blanco")) {
        diagnostico = "Problema con la junta de culata o posible fuga de refrigerante"
        soluciones = [
          "Revisar el nivel de refrigerante y verificar si hay fugas",
          "Realizar una prueba de presión del sistema de refrigeración",
          "Considerar la posibilidad de reemplazar la junta de culata",
          "Consultar con un mecánico especializado para una evaluación completa",
        ]
      } else if (textoCompleto.includes("azul")) {
        diagnostico =
          "Consumo excesivo de aceite, posiblemente debido a desgaste en guías de válvulas o segmentos de pistón"
        soluciones = [
          "Verificar el nivel y estado del aceite del motor",
          "Realizar una prueba de compresión para evaluar el estado de los cilindros",
          "Considerar una reparación del motor si el desgaste es significativo",
          "Consultar con un mecánico especializado",
        ]
      } else if (textoCompleto.includes("negro")) {
        diagnostico = "Mezcla de combustible demasiado rica, posible problema en el sistema de inyección"
        soluciones = [
          "Revisar y limpiar los inyectores de combustible",
          "Verificar el sensor de oxígeno y el sensor MAF",
          "Comprobar el filtro de aire y reemplazarlo si es necesario",
          "Realizar un diagnóstico electrónico completo",
        ]
      } else {
        diagnostico = "Problema en el sistema de escape o combustión"
        soluciones = [
          "Realizar un diagnóstico completo del sistema de escape",
          "Verificar el estado de los sensores de oxígeno",
          "Comprobar el catalizador",
          "Consultar con un mecánico especializado",
        ]
      }
    } else if (textoCompleto.includes("ruido") || textoCompleto.includes("golpeteo")) {
      diagnostico = "Posible problema mecánico en el motor o la transmisión"
      soluciones = [
        "Verificar el nivel y estado del aceite del motor",
        "Revisar los soportes del motor",
        "Realizar un diagnóstico de la transmisión",
        "Consultar con un mecánico para una evaluación detallada",
      ]
    } else if (textoCompleto.includes("arranc") || textoCompleto.includes("encend")) {
      diagnostico = "Problema en el sistema de arranque o encendido"
      soluciones = [
        "Verificar el estado de la batería y las conexiones",
        "Comprobar el motor de arranque y el alternador",
        "Revisar el sistema de encendido (bujías, cables, bobinas)",
        "Realizar un diagnóstico electrónico completo",
      ]
    } else if (textoCompleto.includes("freno") || textoCompleto.includes("frenar")) {
      diagnostico = "Problema en el sistema de frenos"
      soluciones = [
        "Verificar el nivel y estado del líquido de frenos",
        "Inspeccionar el estado de las pastillas y discos de freno",
        "Comprobar el funcionamiento del servofreno",
        "Realizar una revisión completa del sistema de frenos",
      ]
    } else {
      diagnostico =
        "Basado en la información proporcionada, es posible que exista un problema en el sistema relacionado con los síntomas descritos"
      soluciones = [
        "Realizar un diagnóstico electrónico completo",
        "Verificar los niveles de todos los fluidos del vehículo",
        "Inspeccionar los componentes relacionados con los síntomas descritos",
        "Consultar con un mecánico especializado para una evaluación detallada",
      ]
    }

    return `${diagnostico}\n${soluciones.join("\n")}`
  }

  return (
    <div className="home">
      <Header 
        onOBDClick={() => setShowOBD(true)} 
        onManualClick={() => setShowManual(true)} 
      />
      
      {showOBD && <OBDStatus onClose={handleOBDConnected} />}
      {showManual && (
        <TechnicalSheetUpload 
          onExtractionSuccess={handleTechSheetSuccess} 
          onClose={() => setShowManual(false)} 
        />
      )}

      <div className="main-content">
        {state.step === "welcome" && (
          <WelcomeDialog 
            onStart={handleStartDiagnosis} 
            onOBDClick={() => setShowOBD(true)}
            onManualClick={() => setShowManual(true)}
          />
        )}

        {state.step === "vehicleForm" && <VehicleForm onSubmit={handleVehicleSubmit} />}

        {state.step === "chat" && (
          <ChatInterface
            vehicleData={state.vehicleData}
            onSubmit={handleChatSubmit}
            currentQuestion={state.currentQuestion}
            isProcessing={isProcessing}
          />
        )}

        {state.step === "diagnosis" && <Diagnosis diagnosis={state.diagnosis} />}
      </div>
    </div>
  )
}

export default Home
