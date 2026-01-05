"use client"

import { useState, useEffect, useRef } from "react"
import { Capacitor } from '@capacitor/core'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import "./ChatInterface.scss"

function ChatInterface({ vehicleData, onSubmit, currentQuestion, isProcessing, errorMode, mode }) {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const messagesEndRef = useRef(null)

  // Inicializar el chat con la primera pregunta o bienvenida
  useEffect(() => {
    if (messages.length > 0) return;
    
    setIsTyping(true)

    if (mode === "welcome") {
      const timer = setTimeout(() => {
        setMessages([
          {
            sender: "ai",
            text: "¡Hola! Soy tu experto en detectar averías. Vamos a encontrar el problema rápidamente. ¿Cómo quieres empezar?",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
        setShowOptions(true)
      }, 1500)
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => {
        setMessages([
          {
            sender: "ai",
            text: "Describe el problema de tu vehículo con detalle",
            timestamp: new Date(),
          },
        ])
        setIsTyping(false)
      }, 1000)
      return () => clearTimeout(timer);
    }
  }, [mode, messages.length])

  const [showAudioButton, setShowAudioButton] = useState(false)
  const [showImageButton, setShowImageButton] = useState(false)

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

        // Lógica condicional de botones basada en el contenido de la pregunta
        const q = currentQuestion.toLowerCase()
        setShowAudioButton(q.includes("ruido") || q.includes("sonido") || q.includes("escucha") || q.includes("graba"))
        setShowImageButton(q.includes("foto") || q.includes("imagen") || q.includes("ver") || q.includes("muestra"))
      }, 1500)
    }
  }, [currentQuestion, messages])

  // Añadir un efecto para mostrar un mensaje de transición cuando se va a mostrar el diagnóstico
  useEffect(() => {
    if (
      currentQuestion &&
      currentQuestion.includes("última pregunta") &&
      messages.some(
        (m) => m.sender === "user" && messages.indexOf(m) > messages.findIndex((m) => m.text === currentQuestion),
      )
    ) {
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

  const [selectedImage, setSelectedImage] = useState(null)
  const fileInputRef = useRef(null)

  // Función para abrir cámara real o fallback web
  const handleTakePhoto = async () => {
    if (!Capacitor.isNativePlatform()) {
      fileInputRef.current.click()
      return
    }

    try {
      const photo = await Camera.getPhoto({
        quality: 80,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      })

      const response = await fetch(photo.webPath)
      const blob = await response.blob()
      const file = new File([blob], 'camera.jpg', { type: 'image/jpeg' })
      setSelectedImage(file)
    } catch (err) {
      console.error('Error al abrir la cámara:', err)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if ((!inputMessage.trim() && !selectedImage) || isProcessing || isTyping) return

    const userMessage = {
      sender: "user",
      text: inputMessage || (selectedImage ? "Imagen enviada para análisis" : ""),
      image: selectedImage ? URL.createObjectURL(selectedImage) : null,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    onSubmit(inputMessage, selectedImage)
    setInputMessage("")
    setSelectedImage(null)
    setIsTyping(true)
  }

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const formatTime = (date) => date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const [isRecording, setIsRecording] = useState(false)
  const handleVoiceInput = () => {
    if (!isRecording) {
      setIsRecording(true)
      setTimeout(() => {
        const mockVoiceText = "Hola, mi coche hace un ruido extraño al arrancar por las mañanas, como un chirrido metálico."
        setInputMessage(mockVoiceText)
        setIsRecording(false)
      }, 3000)
    }
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
              {message.image && <img src={message.image} alt="Usuario" className="message-image" />}
              <p>{message.text}</p>
              <span className="message-time">{formatTime(message.timestamp)}</span>
            </div>
          </div>
        ))}

        {(isTyping || isProcessing) && (
          <div className="message ai-message">
            <div className="message-content typing-indicator">
              <span></span><span></span><span></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />

        {showOptions && mode === "welcome" && (
          <div className="chat-welcome-options">
            <button onClick={() => onSubmit("manual")} className="option-btn">
              📝 Diagnóstico Manual
            </button>
            {vehicleData?.tipo_vehiculo === "coche" && (
              <button onClick={() => onSubmit("obd")} className="option-btn">
                📡 Diagnóstico OBD-II
              </button>
            )}
          </div>
        )}
      </div>

      {mode !== "welcome" && (
        <form className="chat-input" onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleImageChange}
              hidden
            />
            {showImageButton && (
              <button 
                type="button" 
                className="image-upload-btn"
                onClick={handleTakePhoto}
                disabled={isTyping || isProcessing}
              >
                📷
              </button>
            )}
            {showAudioButton && (
              <button 
                type="button" 
                className={`voice-input-btn ${isRecording ? 'recording' : ''}`}
                onClick={handleVoiceInput}
                disabled={isTyping || isProcessing}
              >
                {isRecording ? '🛑' : '🎤'}
              </button>
            )}
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={selectedImage ? "Añade un comentario a la imagen..." : "Escribe tu respuesta..."}
              disabled={isTyping || isProcessing}
            />
          </div>
          {selectedImage && (
            <div className="image-preview-tag">
              <span>🖼️ {selectedImage.name}</span>
              <button type="button" onClick={() => setSelectedImage(null)}>&times;</button>
            </div>
          )}
          <button type="submit" disabled={(!inputMessage.trim() && !selectedImage) || isTyping || isProcessing}>
            {isProcessing ? "Procesando..." : "Enviar"}
          </button>
        </form>
      )}
    </div>
  )
}

export default ChatInterface
