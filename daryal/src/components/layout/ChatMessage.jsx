"use client"

import { Download } from "lucide-react"

export default function ChatMessage({ message, onExport }) {
  const isUser = message.role === "user"
  const isSystem = message.role === "system"

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="bg-card rounded-xl px-4 py-2 text-sm text-muted-foreground max-w-2xl text-center">
          {message.content}
        </div>
      </div>
    )
  }

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
          isUser ? "bg-muted" : "bg-primary"
        }`}
      >
        <span className="text-xs font-semibold">{isUser ? "TÚ" : "IA"}</span>
      </div>

      <div className={`flex-1 max-w-[70%] ${isUser ? "flex justify-end" : ""}`}>
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser ? "bg-primary text-primary-foreground" : "bg-card text-card-foreground"
          }`}
        >
          {message.type === "buttons" ? (
            <div className="space-y-3">
              <p className="text-sm mb-3">{message.content}</p>
              <div className="flex flex-wrap gap-2">
                {message.buttons.map((button, idx) => (
                  <button
                    key={idx}
                    onClick={button.onClick}
                    className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-full text-sm transition-colors"
                  >
                    {button.label}
                  </button>
                ))}
              </div>
            </div>
          ) : message.type === "image" ? (
            <div>
              <img src={message.content || "/placeholder.svg"} alt="Uploaded" className="rounded-lg max-w-full" />
            </div>
          ) : message.type === "audio" ? (
            <div>
              <audio src={message.content} controls className="w-full" />
            </div>
          ) : (
            <div>
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
              {message.showExport && onExport && (
                <button
                  onClick={onExport}
                  className="mt-3 flex items-center gap-2 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm transition-colors"
                >
                  <Download size={16} />
                  Exportar diagnóstico (PDF)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
