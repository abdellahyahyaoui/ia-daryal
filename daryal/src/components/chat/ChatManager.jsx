"use client"

import { useState, useCallback } from "react"
import { iniciarDiagnostico, continuarDiagnostico, interpretarCodigos, enviarMediaAIA } from "../../api/openai"
import { saveDiagnosis } from "../../utils/storage"

export default function ChatManager({ section, messages, setMessages, setIsTyping }) {
  const [conversationState, setConversationState] = useState({
    step: "initial",
    vehicleData: null,
    historial: [],
    hasAskedForMedia: false,
    mediaAttachments: [],
  })

  const addMessage = useCallback(
    (role, content, type = "text", options = {}) => {
      setMessages((prev) => [
        ...prev,
        {
          role,
          content,
          type,
          ...options,
        },
      ])
    },
    [setMessages],
  )

  const processUserMessage = useCallback(
    async (text, media) => {
      console.log("[v0] Processing user message:", { text, media, state: conversationState.step })

      if (text) {
        addMessage("user", text)
      }

      if (media) {
        const mediaUrl = URL.createObjectURL(media.file)
        addMessage("user", mediaUrl, media.type === "audio" ? "audio" : "image")

        setConversationState((prev) => ({
          ...prev,
          mediaAttachments: [...prev.mediaAttachments, { type: media.type, url: mediaUrl, file: media.file }],
        }))
      }

      setIsTyping(true)

      try {
        switch (conversationState.step) {
          case "awaiting_problem":
            setConversationState((prev) => ({
              ...prev,
              step: "asking_media",
              vehicleData: { ...prev.vehicleData, problema: text },
            }))

            setTimeout(() => {
              setIsTyping(false)
              addMessage(
                "assistant",
                "¿Tienes alguna imagen o audio del problema que puedas compartir? Esto me ayudará a hacer un diagnóstico más preciso.",
                "buttons",
                {
                  buttons: [
                    {
                      label: "Sí, adjuntar ahora",
                      onClick: () => {
                        addMessage("user", "Quiero adjuntar archivos")
                        setConversationState((prev) => ({
                          ...prev,
                          hasAskedForMedia: true,
                        }))
                        setTimeout(() => {
                          addMessage(
                            "assistant",
                            "Perfecto, usa el botón '+' abajo para tomar una foto, seleccionar de la galería o grabar audio. Cuando termines, escribe 'listo' para continuar.",
                          )
                        }, 500)
                      },
                    },
                    {
                      label: "No, continuar",
                      onClick: () => startDiagnosis(text, []),
                    },
                  ],
                },
              )
            }, 1000)
            break

          case "asking_media":
            if (text.toLowerCase().includes("listo") || text.toLowerCase().includes("continuar")) {
              await startDiagnosis(conversationState.vehicleData.problema, conversationState.mediaAttachments)
            }
            break

          case "diagnosing":
            const newHistorial = [...conversationState.historial, { tipo: "respuesta", texto: text }]

            setConversationState((prev) => ({
              ...prev,
              historial: newHistorial,
            }))

            const response = await continuarDiagnostico(newHistorial, conversationState.vehicleData)

            setIsTyping(false)

            if (response.pregunta) {
              addMessage("assistant", response.pregunta)
              setConversationState((prev) => ({
                ...prev,
                historial: [...prev.historial, { tipo: "pregunta", texto: response.pregunta }],
              }))
            } else if (response.diagnostico_y_soluciones) {
              setConversationState((prev) => ({
                ...prev,
                step: "complete",
              }))

              const finalDiagnosis = response.diagnostico_y_soluciones
              addMessage("assistant", `**Diagnóstico Final:**\n\n${finalDiagnosis}`, "text", {
                showExport: true,
              })

              try {
                await saveDiagnosis({
                  vehicleData: conversationState.vehicleData,
                  problema: conversationState.vehicleData.problema,
                  diagnostico: finalDiagnosis,
                  historial: conversationState.historial,
                })
                console.log("[v0] Diagnosis saved successfully")
              } catch (error) {
                console.error("[v0] Failed to save diagnosis:", error)
              }

              if (conversationState.vehicleData.modo === "obd2") {
                setTimeout(() => {
                  addMessage("assistant", "¿Qué deseas hacer ahora?", "buttons", {
                    buttons: [
                      {
                        label: "Borrar códigos DTC",
                        onClick: () => handleClearDTC(),
                      },
                      {
                        label: "Nuevo diagnóstico",
                        onClick: () => window.location.reload(),
                      },
                    ],
                  })
                }, 1000)
              }
            }
            break

          default:
            setIsTyping(false)
            addMessage("assistant", "Por favor, selecciona una opción del menú para comenzar.")
        }
      } catch (error) {
        console.error("[v0] Error processing message:", error)
        setIsTyping(false)
        addMessage("assistant", "Lo siento, hubo un error al procesar tu mensaje. ¿Puedes intentarlo de nuevo?")
      }
    },
    [conversationState, addMessage, setIsTyping],
  )

  const startDiagnosis = async (problema, mediaAttachments) => {
    console.log("[v0] Starting diagnosis with:", { problema, mediaAttachments })

    setIsTyping(true)
    if (!conversationState.hasAskedForMedia) {
      addMessage("user", "No, continuar")
    }

    try {
      let mediaAnalysis = null
      if (mediaAttachments && mediaAttachments.length > 0) {
        addMessage("assistant", "Analizando imágenes y audio con IA...")

        try {
          mediaAnalysis = await enviarMediaAIA(mediaAttachments, {
            problema,
            vehicleType: conversationState.vehicleData.tipo,
          })
          addMessage("assistant", `**Análisis de multimedia:**\n${mediaAnalysis.analisis || "Análisis completado"}`)
        } catch (error) {
          console.error("[v0] Error analyzing media:", error)
          addMessage("assistant", "No pude analizar los archivos multimedia, pero continuaré con el diagnóstico.")
        }
      }

      const vehicleDataWithProblem = {
        ...conversationState.vehicleData,
        problema,
        hasMedia: mediaAttachments && mediaAttachments.length > 0,
        mediaCount: mediaAttachments?.length || 0,
        mediaAnalysis: mediaAnalysis?.analisis || null,
      }

      const response = await iniciarDiagnostico(vehicleDataWithProblem)

      setIsTyping(false)

      if (response.pregunta) {
        addMessage("assistant", response.pregunta)
        setConversationState((prev) => ({
          ...prev,
          step: "diagnosing",
          historial: [{ tipo: "pregunta", texto: response.pregunta }],
        }))
      }
    } catch (error) {
      console.error("[v0] Error starting diagnosis:", error)
      setIsTyping(false)
      addMessage("assistant", "Hubo un error al iniciar el diagnóstico. Por favor, intenta nuevamente.")
    }
  }

  const handleClearDTC = useCallback(async () => {
    addMessage("user", "Borrar códigos DTC")
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      addMessage("assistant", "Códigos DTC borrados exitosamente. Tu vehículo está listo para funcionar.")
    }, 1500)
  }, [addMessage, setIsTyping])

  const initializeManualFlow = useCallback(() => {
    setConversationState({
      step: "awaiting_problem",
      vehicleData: { tipo: section, modo: "manual" },
      historial: [],
      hasAskedForMedia: false,
      mediaAttachments: [],
    })

    addMessage("assistant", "Por favor, describe detalladamente el problema que está experimentando tu vehículo.")
  }, [section, addMessage])

  const initializeOBD2Flow = useCallback(async () => {
    setConversationState({
      step: "connecting_obd2",
      vehicleData: { tipo: section, modo: "obd2" },
      historial: [],
      hasAskedForMedia: false,
      mediaAttachments: [],
    })

    addMessage("assistant", "Iniciando búsqueda de dispositivos OBD2 por Bluetooth...")

    setIsTyping(true)

    setTimeout(() => {
      addMessage("assistant", "Buscando dispositivos OBD2 cercanos...")

      setTimeout(() => {
        addMessage("assistant", "Dispositivo encontrado: ELM327. Conectando...")

        setTimeout(async () => {
          setIsTyping(false)
          addMessage("assistant", "Dispositivo OBD2 conectado exitosamente. Leyendo códigos de diagnóstico...")

          setIsTyping(true)
          setTimeout(async () => {
            const mockCodes = ["P0300", "P0171"]
            setIsTyping(false)

            addMessage(
              "assistant",
              `**Códigos DTC detectados:**\n${mockCodes.map((code) => `• ${code}`).join("\n")}\n\nAnalizando códigos con IA...`,
            )

            setIsTyping(true)
            try {
              const interpretation = await interpretarCodigos(mockCodes)
              setIsTyping(false)

              addMessage(
                "assistant",
                `**Interpretación de códigos:**\n\n${interpretation.diagnostico || "Códigos interpretados correctamente."}\n\nAhora, por favor describe el comportamiento que has notado en tu vehículo para un análisis más completo.`,
              )

              setConversationState((prev) => ({
                ...prev,
                step: "awaiting_problem",
                vehicleData: { ...prev.vehicleData, obd_codes: mockCodes },
              }))
            } catch (error) {
              setIsTyping(false)
              addMessage(
                "assistant",
                "Error al interpretar códigos. Por favor, describe el comportamiento de tu vehículo para continuar.",
              )
              setConversationState((prev) => ({
                ...prev,
                step: "awaiting_problem",
                vehicleData: { ...prev.vehicleData, obd_codes: mockCodes },
              }))
            }
          }, 2000)
        }, 1500)
      }, 1500)
    }, 1000)
  }, [section, addMessage, setIsTyping])

  return {
    processUserMessage,
    initializeManualFlow,
    initializeOBD2Flow,
    conversationState,
  }
}
