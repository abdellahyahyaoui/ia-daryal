"use client"

import { jsPDF } from "jspdf"

export const exportDiagnosisToPDF = (diagnosis) => {
  try {
    const doc = new jsPDF()

    const pageWidth = doc.internal.pageSize.getWidth()
    const margin = 20
    const maxWidth = pageWidth - margin * 2
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Diagnóstico Automotriz", margin, yPosition)
    yPosition += 15

    // Date
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    const date = new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    doc.text(`Fecha: ${date}`, margin, yPosition)
    yPosition += 10

    // Separator
    doc.setDrawColor(200, 200, 200)
    doc.line(margin, yPosition, pageWidth - margin, yPosition)
    yPosition += 10

    // Vehicle Info
    if (diagnosis.vehicleData) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Información del Vehículo", margin, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")

      if (diagnosis.vehicleData.tipo) {
        doc.text(`Tipo: ${diagnosis.vehicleData.tipo}`, margin, yPosition)
        yPosition += 6
      }

      if (diagnosis.vehicleData.modo) {
        doc.text(`Modo de diagnóstico: ${diagnosis.vehicleData.modo}`, margin, yPosition)
        yPosition += 6
      }

      if (diagnosis.vehicleData.obd_codes && diagnosis.vehicleData.obd_codes.length > 0) {
        doc.text(`Códigos DTC: ${diagnosis.vehicleData.obd_codes.join(", ")}`, margin, yPosition)
        yPosition += 6
      }

      yPosition += 5
    }

    // Problem Description
    if (diagnosis.problema) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Descripción del Problema", margin, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const problemLines = doc.splitTextToSize(diagnosis.problema, maxWidth)
      doc.text(problemLines, margin, yPosition)
      yPosition += problemLines.length * 6 + 5
    }

    // Diagnosis Result
    if (diagnosis.diagnostico) {
      doc.setFontSize(14)
      doc.setFont("helvetica", "bold")
      doc.text("Diagnóstico", margin, yPosition)
      yPosition += 8

      doc.setFontSize(10)
      doc.setFont("helvetica", "normal")
      const diagnosisLines = doc.splitTextToSize(diagnosis.diagnostico, maxWidth)

      // Check if we need a new page
      if (yPosition + diagnosisLines.length * 6 > doc.internal.pageSize.getHeight() - margin) {
        doc.addPage()
        yPosition = margin
      }

      doc.text(diagnosisLines, margin, yPosition)
      yPosition += diagnosisLines.length * 6 + 10
    }

    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text("Generado por Sistema de Diagnóstico Automotriz con IA", pageWidth / 2, footerY, { align: "center" })

    // Save the PDF
    const fileName = `diagnostico_${Date.now()}.pdf`
    doc.save(fileName)

    console.log("[v0] PDF exported successfully:", fileName)
    return true
  } catch (error) {
    console.error("[v0] Error exporting PDF:", error)
    throw error
  }
}
