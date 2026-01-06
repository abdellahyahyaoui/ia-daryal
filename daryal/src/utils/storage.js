"use client"

import { Preferences } from "@capacitor/preferences"

const STORAGE_KEY = "diagnosis_history"
const MAX_STORED_DIAGNOSES = 10

export const saveDiagnosis = async (diagnosis) => {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    const history = value ? JSON.parse(value) : []

    const newDiagnosis = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...diagnosis,
    }

    history.unshift(newDiagnosis)

    // Keep only the last MAX_STORED_DIAGNOSES
    const trimmedHistory = history.slice(0, MAX_STORED_DIAGNOSES)

    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(trimmedHistory),
    })

    return newDiagnosis
  } catch (error) {
    console.error("Error saving diagnosis:", error)
    throw error
  }
}

export const getDiagnosisHistory = async () => {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    const history = value ? JSON.parse(value) : []
    return history
  } catch (error) {
    console.error("Error getting diagnosis history:", error)
    return []
  }
}

export const deleteDiagnosis = async (id) => {
  try {
    const { value } = await Preferences.get({ key: STORAGE_KEY })
    const history = value ? JSON.parse(value) : []

    const updatedHistory = history.filter((item) => item.id !== id)

    await Preferences.set({
      key: STORAGE_KEY,
      value: JSON.stringify(updatedHistory),
    })

    return true
  } catch (error) {
    console.error("Error deleting diagnosis:", error)
    throw error
  }
}

export const clearDiagnosisHistory = async () => {
  try {
    await Preferences.remove({ key: STORAGE_KEY })
    return true
  } catch (error) {
    console.error("Error clearing diagnosis history:", error)
    throw error
  }
}
