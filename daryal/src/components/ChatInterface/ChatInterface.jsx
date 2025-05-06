"use client"

import { useState, useEffect, useRef } from "react"
import "./ChatInterface.scss"

function ChatInterface({ vehicleData, onSubmit, currentQuestion, isProcessing, errorMode }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)

  // Inicializar el chat con la primera pregunta
  useEffect(() => {
    // Mostrar el primer mensaje al cargar el componente
    setIsTyping(true)

    setTimeout(() => {
      setMessages([
        {
          sender: "ai",
          text: "Describe el problema de tu vehículo con detalle",
          timestamp: new Date(),
        },
      ])
      setIsTyping(false)
    }, 1000)
  }, [])

  // Añadir nuevas preguntas de la IA cuando cambia currentQuestion
  useEffect(() => {
    if (currentQuestion && !messages.some((m) => m.text === currentQuestion)) {
      setIsTyping(true)

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            sender: "ai",
            text: currentQuestion,
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1500)
    }
  }, [currentQuestion, messages])

  // Modificar el componente ChatInterface para manejar mejor la transición al diagnóstico

  // Añadir un efecto para mostrar un mensaje de transición cuando se va a mostrar el diagnóstico
  useEffect(() => {
    // Si es la última pregunta y el usuario ya respondió, mostrar mensaje de transición
    if (
      currentQuestion &&
      currentQuestion.includes("última pregunta") &&
      messages.some(
        (m) => m.sender === "user" && messages.indexOf(m) > messages.findIndex((m) => m.text === currentQuestion),
      )
    ) {
      // Añadir mensaje de transición si no existe ya
      if (!messages.some((m) => m.text.includes("Gracias por tu información"))) {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              sender: "ai",
              text: "Gracias por tu información. He completado mi análisis y tengo un diagnóstico para ti. Preparando resultados...",
              timestamp: new Date(),
            },
          ])
        }, 1500)
      }
    }
  }, [messages, currentQuestion])

  // Hacer scroll al último mensaje cuando se añade uno nuevo
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isTyping])

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!inputMessage.trim() || isProcessing || isTyping) return

    // Añadir el mensaje del usuario al chat
    const userMessage = {
      sender: "user",
      text: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Enviar la respuesta al componente padre
    onSubmit(inputMessage)

    // Limpiar el input
    setInputMessage("")

    // Mostrar indicador de escritura
    setIsTyping(true)
  }

  // Función para formatear la hora
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="chat-interface">
      <div className="chat-header">
        <h2>Vamos a diagnosticar tu</h2>
        <div className="vehicle-info">
          {vehicleData && (
            <span>
              {vehicleData.marca} {vehicleData.modelo} ({vehicleData.año}) - {vehicleData.combustible}
            </span>
          )}
          {errorMode && <span className="error-badge">Modo demostración</span>}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === "user" ? "user-message" : "ai-message"}`}>
            <div className="message-content">
              <p>{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}

        {(isTyping || isProcessing) && (
          <div className="message ai-message">
            <div className="message-content typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Escribe tu respuesta..."
          disabled={isTyping || isProcessing}
        />
        <button type="submit" disabled={!inputMessage.trim() || isTyping || isProcessing}>
          {isProcessing ? "Procesando..." : "Enviar"}
        </button>
      </form>
    </div>
  )
}

export default ChatInterface
