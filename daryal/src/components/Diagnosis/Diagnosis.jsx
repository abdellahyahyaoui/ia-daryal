
"use client"

import React, { useState, useEffect } from "react"

function Diagnosis({ diagnosis, obdData }) {
  const [clearing, setClearing] = useState(false)
  const [cleared, setCleared] = useState(false)
  const [diagnostico, setDiagnostico] = useState("")
  const [soluciones, setSoluciones] = useState([])

  console.log("🔵 COMPONENTE DIAGNOSIS MOSTRANDO:", diagnosis);

  useEffect(() => {
    if (diagnosis) {
      if (typeof diagnosis === "object") {
        setDiagnostico(diagnosis.diagnostico || diagnosis.diagnosis || "Diagnóstico no disponible")
        setSoluciones(diagnosis.soluciones || diagnosis.solutions || [])
      } else {
        // Limpiar posibles etiquetas de formato del backend
        const cleanDiagnosis = diagnosis.replace(/Diagnóstico:|Soluciones:/gi, "").trim();
        
        // Separar por "Soluciones:" si existe como palabra clave en el string
        const splitIndex = cleanDiagnosis.toLowerCase().indexOf("soluciones:");
        
        if (splitIndex !== -1) {
          setDiagnostico(cleanDiagnosis.substring(0, splitIndex).trim());
          const solsText = cleanDiagnosis.substring(splitIndex + 11).trim();
          const partesSols = solsText.split("\n").filter(p => p.trim() !== "");
          setSoluciones(partesSols.map(s => s.replace(/^\d+\.\s*/, "").trim()));
        } else {
          const partes = cleanDiagnosis.split("\n").filter(p => p.trim() !== "");
          if (partes.length > 1) {
            setDiagnostico(partes[0])
            const sols = partes.slice(1).map(s => s.replace(/^\d+\.\s*/, "").trim());
            setSoluciones(sols)
          } else {
            setDiagnostico(diagnosis)
            setSoluciones([])
          }
        }
      }
    }
  }, [diagnosis])

  const handleClearDTC = () => {
    setClearing(true)
    setTimeout(() => {
      setClearing(false)
      setCleared(true)
    }, 2000)
  }

  return (
    <div className={`diagnosis ${obdData ? 'obd-enriched' : ''}`}>
      <h2>{obdData ? 'Diagnóstico Técnico OBD-II' : 'Tu Diagnóstico '}</h2>
      
      {obdData && (
        <div className="telemetry-grid">
          <div className="telemetry-card">
            <div className="gauge-value">{obdData.rpm}</div>
            <div className="gauge-label">RPM</div>
          </div>
          <div className="telemetry-card">
            <div className="gauge-value">{obdData.temp}</div>
            <div className="gauge-label">Temperatura</div>
          </div>
          <div className="telemetry-card">
            <div className="gauge-value">{obdData.load}</div>
            <div className="gauge-label">Carga</div>
          </div>
          <div className="telemetry-card">
            <div className="gauge-value">{obdData.voltage}</div>
            <div className="gauge-label">Voltaje</div>
          </div>
        </div>
      )}

      {obdData && (
        <div className="dtc-section">
          <h3>Códigos de Error Detectados</h3>
          <div className="dtc-list-visual">
            {cleared ? (
              <div className="no-errors">Todos los códigos han sido borrados</div>
            ) : obdData.dtc && obdData.dtc.length > 0 ? (
              obdData.dtc.map((code, i) => (
                <div key={i} className="dtc-item red">
                  <strong>{code}</strong>
                  <span>Fallo detectado en el sistema</span>
                </div>
              ))
            ) : (
              <div className="no-errors">No se detectaron fallos activos</div>
            )}
          </div>
          {!cleared && obdData.dtc && obdData.dtc.length > 0 && (
            <button 
              className="clear-dtc-btn" 
              onClick={handleClearDTC}
              disabled={clearing}
            >
              {clearing ? "Borrando..." : " Borrar Códigos DTC"}
            </button>
          )}
        </div>
      )}

      <div className="ai-analysis-section">
        <h3>{obdData ? 'Análisis del Experto Daryal' : 'Resultados'}</h3>
        <div className="diagnosis-content">
          <p className="main-diag">{diagnostico}</p>
          {soluciones.length > 0 && (
            <div className="solutions-list">
              <h4>Soluciones Recomendadas:</h4>
              <ul>
                {soluciones.map((sol, i) => <li key={i}>{sol}</li>)}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="action-buttons">
        <button className="secondary-button" onClick={() => window.print()}> Exportar Informe</button>
        <button className="primary-button" onClick={() => window.location.reload()}>
          Nuevo Diagnóstico
        </button>
      </div>
    </div>
  )
}

export default Diagnosis

