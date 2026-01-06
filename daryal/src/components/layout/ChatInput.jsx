"use client"

import { useState, useRef } from "react"
import { Send, Plus, ImageIcon, Mic, Camera, X, Square } from "lucide-react"
import MediaCapture from "../media/MediaCapture"

export default function ChatInput({ onSubmit, disabled }) {
  const [input, setInput] = useState("")
  const [attachedMedia, setAttachedMedia] = useState(null)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const fileInputRef = useRef(null)

  const {
    capturePhoto,
    selectImage,
    startAudioRecording,
    stopAudioRecording,
    isRecording,
    audioBlob,
  } = MediaCapture()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() || attachedMedia) {
      onSubmit(input, attachedMedia)
      setInput("")
      setAttachedMedia(null)
    }
  }

  const handleAttachment = async (type) => {
    setShowAttachMenu(false)

    try {
      if (type === "camera") {
        const photoPath = await capturePhoto()
        const response = await fetch(photoPath)
        const blob = await response.blob()
        const file = new File([blob], "photo.jpg", { type: "image/jpeg" })
        setAttachedMedia({ type: "image", file })
      } else if (type === "gallery") {
        const imagePath = await selectImage()
        const response = await fetch(imagePath)
        const blob = await response.blob()
        const file = new File([blob], "image.jpg", { type: "image/jpeg" })
        setAttachedMedia({ type: "image", file })
      } else if (type === "file") {
        fileInputRef.current?.click()
      } else if (type === "audio") {
        await startAudioRecording()
      }
    } catch (error) {
      console.error("[v0] Error handling attachment:", error)
      alert("Error al capturar/seleccionar media. Por favor, intenta de nuevo.")
    }
  }

  const handleStopRecording = async () => {
    stopAudioRecording()

    setTimeout(() => {
      if (audioBlob) {
        const file = new File([audioBlob], "audio.webm", { type: "audio/webm" })
        setAttachedMedia({ type: "audio", file })
      }
    }, 500)
  }

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAttachedMedia({ type: "image", file })
    }
    e.target.value = null // Permite seleccionar el mismo archivo de nuevo
  }

  return (
    <div className="input-container">
  {/* Preview de adjuntos */}
  {attachedMedia && (
    <div className="attachment-preview">
      {attachedMedia.type === "image" ? <ImageIcon size={14} /> : <Mic size={14} />}
      <span>{attachedMedia.file?.name || `${attachedMedia.type} adjunto`}</span>
      <button onClick={() => setAttachedMedia(null)}><X size={14} /></button>
    </div>
  )}

  {/* Preview de grabación de audio */}
  {isRecording && (
    <div className="attachment-preview" style={{ color: "red" }}>
      <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
      <span>Grabando audio...</span>
      <button onClick={handleStopRecording}><Square size={14} fill="currentColor" /></button>
    </div>
  )}

  <form onSubmit={handleSubmit} className="chat-input-form">
    <div className="relative w-full">
      {/* Botón "+" */}
      <button
        type="button"
        onClick={() => setShowAttachMenu(!showAttachMenu)}
        disabled={disabled || isRecording}
        className={`attach-btn ${showAttachMenu ? "active" : ""}`}
      >
        <Plus size={20} />
      </button>

      {/* Menú flotante justo encima del input */}
      {showAttachMenu && (
        <div className="attach-menu-floating">
          <button type="button" onClick={() => handleAttachment("camera")}>
            <Camera size={18} /><span>Tomar foto</span>
          </button>
          <button type="button" onClick={() => handleAttachment("gallery")}>
            <ImageIcon size={18} /><span>Galería</span>
          </button>
          <button type="button" onClick={() => handleAttachment("file")}>
            <ImageIcon size={18} /><span>Subir archivo</span>
          </button>
          <button type="button" onClick={() => handleAttachment("audio")}>
            <Mic size={18} /><span>Grabar audio</span>
          </button>
        </div>
      )}
    </div>

    {/* Input de archivos oculto */}
    <input
      type="file"
      ref={fileInputRef}
      onChange={handleFileSelect}
      accept="image/*"
      className="hidden"
    />

    {/* Textarea */}
    <textarea
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onFocus={() => setShowAttachMenu(false)} // <- Desaparece el menú al tocar
      onKeyDown={(e) => {
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault()
          handleSubmit(e)
        }
      }}
      placeholder="Escribe un mensaje..."
      disabled={disabled || isRecording}
      rows={1}
      className="text-input"
    />

    {/* Botón enviar */}
    <button
      type="submit"
      disabled={disabled || isRecording || (!input.trim() && !attachedMedia)}
      className="send-btn"
    >
      <Send size={18} />
    </button>
  </form>
</div>

  )
}
