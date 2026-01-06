import React, { useState, useEffect, useRef } from "react"
import { Menu } from "lucide-react"
import Header from "../Header/Header"
import ChatInput from "./ChatInput"
import Robot from "../robot/Robot"
import "./ChatLayout.scss"

export default function ChatLayout({ 
  messages, 
  onSendMessage, 
  isTyping, 
  renderComponent 
}) {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  return (
    <div className="chat-layout">
      <header className="chat-header-fixed">
        <Robot />
      </header>

      <main className="chat-messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={`message-row ${msg.sender}`}>
            <div className="message-bubble">
              {msg.text && <p>{msg.text}</p>}
              {msg.component && (
                <div className="component-wrapper">
                  {renderComponent(msg.component)}
                </div>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="message-row ai">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span><span></span><span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      <footer className="chat-input-fixed">
        <ChatInput onSubmit={onSendMessage} disabled={isTyping} />
      </footer>
    </div>
  )
}
