"use client"

import React from "react"
import { Clock, Trash2 } from "lucide-react"
import { getHistory, deleteFromHistory } from "../utils/historyStorage"

export default function HistoryPanel({ onSelectDiagnosis }) {
  const [history, setHistory] = React.useState([])

  React.useEffect(() => {
    setHistory(getHistory())
  }, [])

  const handleDelete = (id, e) => {
    e.stopPropagation()
    deleteFromHistory(id)
    setHistory(getHistory())
  }

  const formatDate = (isoString) => {
    const date = new Date(isoString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (history.length === 0) {
    return (
      <div style={{ padding: "20px", color: "var(--text-secondary)", textAlign: "center" }}>
        <p>No hay diagnósticos guardados</p>
      </div>
    )
  }

  return (
    <div
      style={{
        padding: "20px",
        maxHeight: "400px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h3
        style={{
          fontSize: "1rem",
          marginBottom: "16px",
          color: "var(--text-primary)",
        }}
      >
        Historial de Diagnósticos
      </h3>

      {history.map((item) => (
        <div
          key={item.id}
          onClick={() => onSelectDiagnosis(item)}
          style={{
            background: "var(--bg-tertiary)",
            borderRadius: "12px",
            padding: "12px",
            cursor: "pointer",
            border: "1px solid var(--border-color)",
            transition: "all 0.2s ease",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background =
              "linear-gradient(135deg, rgba(102, 126, 234, 0.1), rgba(118, 75, 162, 0.1))"
            e.currentTarget.style.transform = "translateX(4px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "var(--bg-tertiary)"
            e.currentTarget.style.transform = "translateX(0)"
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <Clock size={14} color="var(--text-secondary)" />
              <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{formatDate(item.timestamp)}</span>
            </div>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-primary)",
                margin: 0,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {item.diagnostico?.substring(0, 50) || "Diagnóstico sin descripción"}...
            </p>
          </div>

          <button
            onClick={(e) => handleDelete(item.id, e)}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-secondary)",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "4px",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff4444"
              e.currentTarget.style.background = "rgba(255, 68, 68, 0.1)"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--text-secondary)"
              e.currentTarget.style.background = "none"
            }}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}
