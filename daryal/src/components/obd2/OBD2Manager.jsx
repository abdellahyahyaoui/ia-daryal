"use client"

import { useState, useCallback } from "react"
import { BleClient } from "@capacitor-community/bluetooth-le"

export default function OBD2Manager() {
  const [devices, setDevices] = useState([])
  const [device, setDevice] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [dtcCodes, setDtcCodes] = useState([])
  const [isScanning, setIsScanning] = useState(false)

  const initializeBluetooth = useCallback(async () => {
    try {
      await BleClient.initialize()

      const permissions = await BleClient.requestLocationPermission()

      if (!permissions) {
        throw new Error("Permisos de ubicación denegados. Son necesarios para Bluetooth.")
      }

      console.log("[v0] Bluetooth initialized with permissions")
      return true
    } catch (error) {
      console.error("[v0] Error initializing Bluetooth:", error)
      alert(`Error al inicializar Bluetooth: ${error.message}`)
      return false
    }
  }, [])

  const scanForDevices = useCallback(async () => {
    try {
      setIsScanning(true)
      setDevices([])
      console.log("[v0] Scanning for ALL Bluetooth devices...")

      const foundDevices = []

      await BleClient.requestLEScan({}, (result) => {
        console.log("[v0] Device found:", result.device)
        
        // Removed filter to show all devices
        if (!foundDevices.find((d) => d.deviceId === result.device.deviceId)) {
          foundDevices.push({
            deviceId: result.device.deviceId,
            name: result.device.name || "Dispositivo desconocido",
            rssi: result.rssi,
          })
          setDevices([...foundDevices])
        }
      })

      setTimeout(async () => {
        await BleClient.stopLEScan()
        setIsScanning(false)
        console.log("[v0] Scan complete. Found devices:", foundDevices.length)

        if (foundDevices.length === 0) {
          alert("No se encontraron dispositivos Bluetooth. Asegúrate de que estén encendidos y cerca.")
        }
      }, 10000)

      return foundDevices
    } catch (error) {
      console.error("[v0] Error scanning for devices:", error)
      setIsScanning(false)
      alert(`Error al buscar dispositivos: ${error.message}`)
      throw error
    }
  }, [])

  const connectToDevice = useCallback(async (deviceId) => {
    try {
      console.log("[v0] Connecting to device:", deviceId)

      await BleClient.connect(deviceId, (disconnectedDeviceId) => {
        console.log("[v0] Device disconnected:", disconnectedDeviceId)
        setIsConnected(false)
        alert("Dispositivo desconectado")
      })

      setIsConnected(true)
      setDevice(deviceId)
      console.log("[v0] Connected to device successfully")
      alert("Conectado exitosamente al dispositivo")
      return true
    } catch (error) {
      console.error("[v0] Error connecting to device:", error)
      alert(`Error al conectar: ${error.message}`)
      return false
    }
  }, [])

  const readDTCCodes = useCallback(async (deviceId) => {
    try {
      console.log("[v0] Reading DTC codes...")

      const OBD2_SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"
      const OBD2_CHARACTERISTIC_UUID = "0000fff1-0000-1000-8000-00805f9b34fb"

      const command = "03\r"
      const encoder = new TextEncoder()
      const data = encoder.encode(command)

      await BleClient.write(deviceId, OBD2_SERVICE_UUID, OBD2_CHARACTERISTIC_UUID, data)

      const response = await BleClient.read(deviceId, OBD2_SERVICE_UUID, OBD2_CHARACTERISTIC_UUID)

      const decoder = new TextDecoder()
      const responseText = decoder.decode(response)
      const codes = parseDTCCodes(responseText)

      console.log("[v0] DTC codes read:", codes)
      setDtcCodes(codes)
      return codes
    } catch (error) {
      console.error("[v0] Error reading DTC codes:", error)
      alert("Este dispositivo no es compatible con OBD2 o no tiene el servicio adecuado.")
      return []
    }
  }, [])

  const clearDTCCodes = useCallback(async (deviceId) => {
    try {
      console.log("[v0] Clearing DTC codes...")

      const OBD2_SERVICE_UUID = "0000fff0-0000-1000-8000-00805f9b34fb"
      const OBD2_CHARACTERISTIC_UUID = "0000fff1-0000-1000-8000-00805f9b34fb"

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
      console.log("[v0] Disconnected from device")
    } catch (error) {
      console.error("[v0] Error disconnecting:", error)
    }
  }, [])

  return {
    devices,
    device,
    isConnected,
    isScanning,
    dtcCodes,
    initializeBluetooth,
    scanForDevices,
    connectToDevice,
    readDTCCodes,
    clearDTCCodes,
    disconnect,
  }
}

function parseDTCCodes(response) {
  const codes = []
  const lines = response.split("\n")

  for (const line of lines) {
    const cleaned = line.trim()
    if (/^[PCBU][0-9A-F]{4}$/i.test(cleaned)) {
      codes.push(cleaned.toUpperCase())
    }
  }

  return codes
}
