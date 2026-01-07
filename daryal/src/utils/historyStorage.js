const HISTORY_KEY = "diagnosis_history"
const MAX_HISTORY_ITEMS = 50

export const saveToHistory = (diagnosis) => {
  try {
    const history = getHistory()
    const newItem = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...diagnosis,
    }

    const updatedHistory = [newItem, ...history].slice(0, MAX_HISTORY_ITEMS)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    return true
  } catch (error) {
    console.error("[v0] Error saving to history:", error)
    return false
  }
}

export const getHistory = () => {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error("[v0] Error reading history:", error)
    return []
  }
}

export const deleteFromHistory = (id) => {
  try {
    const history = getHistory()
    const updatedHistory = history.filter((item) => item.id !== id)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory))
    return true
  } catch (error) {
    console.error("[v0] Error deleting from history:", error)
    return false
  }
}

export const clearHistory = () => {
  try {
    localStorage.removeItem(HISTORY_KEY)
    return true
  } catch (error) {
    console.error("[v0] Error clearing history:", error)
    return false
  }
}
