"use client"

import { Suspense, useEffect, useState, Component } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei"

class WebGLErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || null
    }
    return this.props.children
  }
}

function Model() {
  const { scene, animations } = useGLTF("/planosGLb/futur.glb")
  const { actions } = useAnimations(animations, scene)

  useEffect(() => {
    scene.position.set(0, -1.5, 0) // 🔑 BAJA el modelo
    scene.scale.set(5, 5, 5) // 🔑 NO exageres escala
  }, [scene])

  useEffect(() => {
    const first = actions && Object.keys(actions)[0]
    if (first) actions[first].play()
  }, [actions])

  return <primitive object={scene} />
}

function checkWebGLSupport() {
  try {
    const canvas = document.createElement("canvas")
    return !!(window.WebGLRenderingContext && (canvas.getContext("webgl") || canvas.getContext("experimental-webgl")))
  } catch (e) {
    return false
  }
}

export default function RobotComponent() {
  const [webGLSupported, setWebGLSupported] = useState(true)

  useEffect(() => {
    setWebGLSupported(checkWebGLSupport())
  }, [])

  if (!webGLSupported) {
    return (
      <div className="robot-fixed-container">
        <div className="robot-placeholder"></div>
      </div>
    )
  }

  return (
    <div className="robot-fixed-container">
      <WebGLErrorBoundary fallback={<div className="robot-placeholder"></div>}>
        <Canvas
        camera={{ position: [0, 1.5, 10], fov: 35 }}
          gl={{ alpha: true, antialias: true }}
          onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
        >
          <ambientLight intensity={1} />
          <directionalLight intensity={1.5} position={[5, 5, 5]} />
          <Suspense fallback={null}>
            <Model />
          </Suspense>
          <OrbitControls
  target={[0, 1, 0]}
  enableZoom={false}
  enablePan={false}
  autoRotate
  autoRotateSpeed={0.6}
/>

        </Canvas>
      </WebGLErrorBoundary>
    </div>
  )
}
