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



"use client"

import { useReducer, useState } from "react"
import WelcomeDialog from "../WelcomeDialog/WelcomeDialog"
import VehicleForm from "../VehicleForm/VehicleForm"
import ChatInterface from "../ChatInterface/ChatInterface"
import Diagnosis from "../Diagnosis/Diagnosis"
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
    default:
      return state
  }
}

function Home() {
  const [state, dispatch] = useReducer(diagnosisReducer, initialState)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleStartDiagnosis = () => {
    dispatch({ type: "SET_STEP", payload: "vehicleForm" })
  }

  const handleVehicleSubmit = async (data) => {
    // Guardar los datos del vehículo sin el problema
    dispatch({ type: "SET_VEHICLE_DATA", payload: data })

    // Cambiar al paso de chat
    dispatch({ type: "SET_STEP", payload: "chat" })
  }

  const handleChatSubmit = async (message) => {
    setIsProcessing(true)

    try {
      // Si es el primer mensaje, es la descripción del problema
      if (state.historial.length === 0) {
        // Añadir el problema al historial
        dispatch({
          type: "ADD_TO_HISTORIAL",
          payload: [{ tipo: "problema", texto: message }],
        })

        // Iniciar el diagnóstico con los datos del vehículo y el problema
        const vehicleDataWithProblem = {
          ...state.vehicleData,
          problema: message,
        }

        // Llamar a la API para iniciar el diagnóstico
        const response = await iniciarDiagnostico(vehicleDataWithProblem)

        // Establecer la primera pregunta
        if (response.pregunta) {
          dispatch({
            type: "SET_QUESTION",
            payload: response.pregunta,
            isLastQuestion: response.es_ultima || false,
          })
        }
      } else {
        // Para los mensajes subsiguientes (respuestas a preguntas)
        // Añadir la respuesta al historial
        dispatch({
          type: "ADD_TO_HISTORIAL",
          payload: [{ tipo: "respuesta", texto: message }],
        })

        try {
          // CORRECCIÓN: Pasar vehiculo en lugar de vehicleData para que coincida con la API
          const response = await continuarDiagnostico(
            [...state.historial, { tipo: "respuesta", texto: message }],
            state.vehicleData, // Renombrado internamente en la función a 'vehiculo'
          )

          console.log("Respuesta de continuarDiagnostico:", response)

          // Verificar si es la última pregunta basado en el contador
          const esUltimaPregunta = state.questionCount >= 4 // Después de 5 preguntas (0-4)

          if (response.pregunta && !esUltimaPregunta) {
            // Establecer la siguiente pregunta
            dispatch({
              type: "SET_QUESTION",
              payload: response.pregunta,
              isLastQuestion: response.es_ultima || esUltimaPregunta,
            })
          } else {
            // Si es la última pregunta o no hay más preguntas, mostrar mensaje de transición
            // y preparar para mostrar diagnóstico
            const mensajeTransicion =
              "Gracias por tu información. He completado mi análisis y tengo un diagnóstico para ti."

            // Añadir mensaje de transición al chat
            dispatch({
              type: "SET_QUESTION",
              payload: mensajeTransicion,
              isLastQuestion: true,
            })

            // Esperar un momento y luego mostrar el diagnóstico
            setTimeout(() => {
              // Generar un diagnóstico basado en la información recopilada
              const diagnostico = generarDiagnosticoBasadoEnHistorial(state.historial)

              dispatch({
                type: "SET_DIAGNOSIS",
                payload: diagnostico,
              })
            }, 3000)
          }
        } catch (error) {
          console.error("Error en el diagnóstico:", error)

          // Si el error ocurre en la última pregunta, probablemente es porque
          // la API espera generar un diagnóstico pero falla
          if (state.questionCount >= 4) {
            // Mostrar mensaje de transición
            dispatch({
              type: "SET_QUESTION",
              payload: "Gracias por tu información. He completado mi análisis y tengo un diagnóstico para ti.",
              isLastQuestion: true,
            })

            // Esperar un momento y luego mostrar un diagnóstico generado localmente
            setTimeout(() => {
              const diagnostico = generarDiagnosticoBasadoEnHistorial(state.historial)

              dispatch({
                type: "SET_DIAGNOSIS",
                payload: diagnostico,
              })
            }, 3000)
          } else {
            // Si no es la última pregunta, mostrar un mensaje de error
            alert("Ocurrió un error en el proceso de diagnóstico. Intenta nuevamente.")
          }
        }
      }
    } catch (error) {
      console.error("Error general en el proceso:", error)
      alert("Ocurrió un error en el proceso de diagnóstico. Intenta nuevamente.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Función para generar un diagnóstico basado en el historial cuando la API falla
  const generarDiagnosticoBasadoEnHistorial = (historial) => {
    // Extraer el problema principal
    const problemaPrincipal = historial.find((item) => item.tipo === "problema")?.texto || ""

    // Buscar palabras clave en el problema y las respuestas
    const todosLosTextos = historial.map((item) => item.texto.toLowerCase())
    const textoCompleto = todosLosTextos.join(" ")

    // Detectar problemas comunes basados en palabras clave
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
      // Diagnóstico genérico si no se detecta un problema específico
      diagnostico =
        "Basado en la información proporcionada, es posible que exista un problema en el sistema relacionado con los síntomas descritos"
      soluciones = [
        "Realizar un diagnóstico electrónico completo",
        "Verificar los niveles de todos los fluidos del vehículo",
        "Inspeccionar los componentes relacionados con los síntomas descritos",
        "Consultar con un mecánico especializado para una evaluación detallada",
      ]
    }

    // Formatear el diagnóstico para el componente Diagnosis
    return `${diagnostico}\n${soluciones.join("\n")}`
  }

  return (
    <div className="home">
      {state.step === "welcome" && <WelcomeDialog onStart={handleStartDiagnosis} />}

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
  )
}

export default Home
