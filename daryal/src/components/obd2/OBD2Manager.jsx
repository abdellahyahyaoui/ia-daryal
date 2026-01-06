"use client"

import { useState, useCallback } from "react"
import { BleClient } from "@capacitor-community/bluetooth-le"

const OBD2_SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"
const OBD2_CHARACTERISTIC_UUID = "0000fff1-0000-1000-8000-00805f9b34fb"

export default function OBD2Manager() {
  const [device, setDevice] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [dtcCodes, setDtcCodes] = useState([])

  const initializeBluetooth = useCallback(async () => {
    try {
      await BleClient.initialize()
      console.log("[v0] Bluetooth initialized")
      return true
    } catch (error) {
      console.error("[v0] Error initializing Bluetooth:", error)
      return false
    }
  }, [])

  const scanForDevices = useCallback(async () => {
    try {
      console.log("[v0] Scanning for OBD2 devices...")

      const devices = await BleClient.requestDevice({
        services: [OBD2_SERVICE_UUID],
        optionalServices: [],
      })

      console.log("[v0] Device found:", devices)
      setDevice(devices)
      return devices
    } catch (error) {
      console.error("[v0] Error scanning for devices:", error)
      throw error
    }
  }, [])

  const connectToDevice = useCallback(async (deviceId) => {
    try {
      console.log("[v0] Connecting to device:", deviceId)

      await BleClient.connect(deviceId, (disconnectedDeviceId) => {
        console.log("[v0] Device disconnected:", disconnectedDeviceId)
        setIsConnected(false)
      })

      setIsConnected(true)
      console.log("[v0] Connected to OBD2 device")
      return true
    } catch (error) {
      console.error("[v0] Error connecting to device:", error)
      return false
    }
  }, [])

  const readDTCCodes = useCallback(async (deviceId) => {
    try {
      console.log("[v0] Reading DTC codes...")

      // Send command to read DTCs (Mode 03)
      const command = "03\r"
      const encoder = new TextEncoder()
      const data = encoder.encode(command)

      await BleClient.write(deviceId, OBD2_SERVICE_UUID, OBD2_CHARACTERISTIC_UUID, data)

      // Read response
      const response = await BleClient.read(deviceId, OBD2_SERVICE_UUID, OBD2_CHARACTERISTIC_UUID)

      // Parse DTC codes from response
      const decoder = new TextDecoder()
      const responseText = decoder.decode(response)
      const codes = parseDTCCodes(responseText)

      console.log("[v0] DTC codes read:", codes)
      setDtcCodes(codes)
      return codes
    } catch (error) {
      console.error("[v0] Error reading DTC codes:", error)
      return []
    }
  }, [])

  const clearDTCCodes = useCallback(async (deviceId) => {
    try {
      console.log("[v0] Clearing DTC codes...")

      const command = "04\r"
      const encoder = new TextEncoder()
      const data = encoder.encode(command)

      await BleClient.write(deviceId, OBD2_SERVICE_UUID, OBD2_CHARACTERISTIC_UUID, data)

      console.log("[v0] DTC codes cleared")
      setDtcCodes([])
      return true
    } catch (error) {
      console.error("[v0] Error clearing DTC codes:", error)
      return false
    }
  }, [])

  const disconnect = useCallback(async (deviceId) => {
    try {
      await BleClient.disconnect(deviceId)
      setIsConnected(false)
      setDevice(null)
      console.log("[v0] Disconnected from OBD2 device")
    } catch (error) {
      console.error("[v0] Error disconnecting:", error)
    }
  }, [])

  return {
    device,
    isConnected,
    dtcCodes,
    initializeBluetooth,
    scanForDevices,
    connectToDevice,
    readDTCCodes,
    clearDTCCodes,
    disconnect,
  }
}

// Helper function to parse DTC codes from OBD2 response
function parseDTCCodes(response) {
  const codes = []
  const lines = response.split("\n")

  for (const line of lines) {
    // Remove whitespace and check if it's a valid DTC code
    const cleaned = line.trim()
    if (/^[PCBU][0-9A-F]{4}$/i.test(cleaned)) {
      codes.push(cleaned.toUpperCase())
    }
  }

  return codes
}
