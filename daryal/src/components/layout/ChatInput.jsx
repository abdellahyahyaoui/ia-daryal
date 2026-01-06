"use client"

import { useState, useRef } from "react"
import { Send, Plus, ImageIcon, Mic, Camera, X, Square } from "lucide-react"
import MediaCapture from "../media/MediaCapture"
import "./ChatInput.css"

export default function ChatInput({ onSubmit, onAttachment, disabled }) {
  const [input, setInput] = useState("")
  const [attachedMedia, setAttachedMedia] = useState(null)
  const [showAttachMenu, setShowAttachMenu] = useState(false)
  const fileInputRef = useRef(null)

  const { capturePhoto, selectImage, startAudioRecording, stopAudioRecording, isRecording, audioBlob } = MediaCapture()

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

    // Wait for audioBlob to be set
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
  }

  return (
    <div className="border-t border-border bg-background">
      <div className="max-w-3xl mx-auto p-4">
        {attachedMedia && (
          <div className="mb-2 flex items-center gap-2 bg-card rounded-lg p-2">
            {attachedMedia.type === "image" ? (
              <ImageIcon size={16} className="text-muted-foreground" />
            ) : (
              <Mic size={16} className="text-muted-foreground" />
            )}
            <span className="text-sm text-muted-foreground flex-1">
              {attachedMedia.file?.name || `${attachedMedia.type} adjunto`}
            </span>
            <button onClick={() => setAttachedMedia(null)} className="text-muted-foreground hover:text-foreground">
              <X size={16} />
            </button>
          </div>
        )}

        {isRecording && (
          <div className="mb-2 flex items-center gap-2 bg-destructive/10 rounded-lg p-3">
            <div className="flex items-center gap-2 flex-1">
              <div className="w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-destructive">Grabando audio...</span>
            </div>
            <button
              onClick={handleStopRecording}
              className="p-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors"
            >
              <Square size={16} fill="currentColor" />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          {/* Attach button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAttachMenu(!showAttachMenu)}
              disabled={disabled || isRecording}
              className="p-2 rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
            >
              <Plus size={20} />
            </button>

            {showAttachMenu && (
              <div className="absolute bottom-full left-0 mb-2 bg-card border border-border rounded-lg shadow-lg overflow-hidden z-50">
                <button
                  type="button"
                  onClick={() => handleAttachment("camera")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Camera size={16} />
                  <span>Tomar foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachment("gallery")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <ImageIcon size={16} />
                  <span>Galería</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachment("file")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <ImageIcon size={16} />
                  <span>Subir archivo</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleAttachment("audio")}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-accent transition-colors"
                >
                  <Mic size={16} />
                  <span>Grabar audio</span>
                </button>
              </div>
            )}
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />

          {/* Text input */}
          <div className="flex-1 bg-input rounded-2xl border border-border focus-within:border-ring transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSubmit(e)
                }
              }}
              placeholder="Escribe tu mensaje..."
              disabled={disabled || isRecording}
              rows={1}
              className="w-full bg-transparent px-4 py-3 resize-none outline-none placeholder:text-muted-foreground disabled:opacity-50"
              style={{ maxHeight: "200px" }}
            />
          </div>

          {/* Send button */}
          <button
            type="submit"
            disabled={disabled || isRecording || (!input.trim() && !attachedMedia)}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  )
}
