import React, { useEffect, useRef } from "react"
import ChatInput from "./ChatInput"
import Robot from "../robot/Robot"

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
      <div className="chat-robot-overlay">
        <Robot />
      </div>
      <header className="chat-header-fixed">
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
