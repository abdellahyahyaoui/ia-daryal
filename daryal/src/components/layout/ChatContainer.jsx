"use client"

import { useEffect, useRef } from "react"
import ChatMessage from "./ChatMessage"
import "./ChatContainer.css"

export default function ChatContainer({ messages, isTyping, onExport }) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 chat-container">
      <div className="max-w-3xl mx-auto space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} onExport={onExport} />
        ))}

        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-semibold text-primary-foreground">IA</span>
            </div>
            <div className="flex-1 bg-card rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                ></span>
                <span
                  className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                ></span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  )
}
