"use client"

import { useState, useRef, useCallback } from "react"
import { Camera } from "@capacitor/camera"
import { CameraResultType, CameraSource } from "@capacitor/camera"

export default function MediaCapture() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState(null)
  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])

  const capturePhoto = useCallback(async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera,
      })

      console.log("[v0] Photo captured:", image.webPath)
      return image.webPath
    } catch (error) {
      console.error("[v0] Error capturing photo:", error)
      throw error
    }
  }, [])

  const selectImage = useCallback(async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
      })

      console.log("[v0] Image selected:", image.webPath)
      return image.webPath
    } catch (error) {
      console.error("[v0] Error selecting image:", error)
      throw error
    }
  }, [])

  const startAudioRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)

      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" })
        setAudioBlob(audioBlob)
        console.log("[v0] Audio recording stopped, blob created")

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      console.log("[v0] Audio recording started")
    } catch (error) {
      console.error("[v0] Error starting audio recording:", error)
      throw error
    }
  }, [])

  const stopAudioRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      console.log("[v0] Stopping audio recording...")
    }
  }, [isRecording])

  return {
    capturePhoto,
    selectImage,
    startAudioRecording,
    stopAudioRecording,
    isRecording,
    audioBlob,
  }
}
