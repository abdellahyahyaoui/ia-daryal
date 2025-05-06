"use client"

import { useGLTF } from "@react-three/drei"
import { useEffect, useState } from "react"

function CarModel({ url }) {
  const { scene } = useGLTF(url)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile() // verificar al montar
    window.addEventListener("resize", checkMobile)

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    if (scene) {
      scene.traverse((child) => {
        if (child.isMesh && child.material) {
          child.material.roughness = Math.max(0.1, child.material.roughness * 0.7)
          child.material.metalness = Math.min(1, child.material.metalness * 1.2)
          child.material.envMapIntensity = 1.5
          child.material.needsUpdate = true
        }
      })
    }
  }, [scene])

  if (isMobile) return null // no renderizar en móviles

  // Ajustes visuales
  scene.position.set(0, -2.5, 0)
  scene.scale.set(2.5, 2.5, 2.5)
  scene.rotation.set(0, Math.PI / 4, 0)

  return <primitive object={scene} />
}

export default CarModel
