// "use client"

// import { Canvas } from "@react-three/fiber";
// import { OrbitControls } from "@react-three/drei";
// import { Suspense, useEffect, useState } from "react";
// import "./Fondo.css";
// import CarModel from "../car-model/CarModel"; // Asegúrate de que la ruta sea correcta

// export default function Scene() {
//   const [cameraPosition, setCameraPosition] = useState([5, 2, 5]);

//   useEffect(() => {
//     const updateCameraPosition = () => {
//       if (window.innerWidth <= 768) {
//         setCameraPosition([5, 3, 5]); // Posición de la cámara para pantallas pequeñas
//       } else {
//         setCameraPosition([5, 0, 5]); // Posición de la cámara para pantallas grandes
//       }
//     };

//     updateCameraPosition();
//     window.addEventListener("resize", updateCameraPosition);

//     return () => {
//       window.removeEventListener("resize", updateCameraPosition);
//     };
//   }, []);

//   return (
//     <div className="scene-container">
//       <Canvas camera={{ position: cameraPosition }} style={{ width: "100%", height: "100%" }}>
//         <Suspense fallback={null}>
//           {/* Asegúrate de que la ruta del modelo GLB sea correcta */}
//           <CarModel url="/planosGLb/lambo1.glb" position={[0, 0, 0]} scale={[1, 1, 1]} />
//         </Suspense>

//         {/* Iluminación básica */}
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
//         <directionalLight position={[-10, 10, 5]} intensity={1.0} color="#ffffff" />
//         <hemisphereLight intensity={0.5} color="#88ccff" groundColor="#8844aa" />

//         {/* Controles de la cámara */}
//         <OrbitControls
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//           zoomSpeed={0.6}
//           panSpeed={0.5}
//           rotateSpeed={0.4}
//           minDistance={9} // Mínimo acercamiento
//           maxDistance={9} // Máxima distancia
//           minPolarAngle={Math.PI / 2} // Límite hacia abajo
//           maxPolarAngle={Math.PI / 2} // Límite hacia arriba
//           autoRotate={false} // Rotación automática
//           autoRotateSpeed={0.5} // Velocidad de rotación
//         />
//       </Canvas>
//     </div>
//   );
// }
"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Environment } from "@react-three/drei"
import { Suspense, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import "./Fondo.css"
import CarModel from "../car-model/CarModel"

// Mapeo de rutas a nmodelos 3D
const MODEL_MAPPING = {
  "/": "/planosGLb/lambo1.glb", // Ruta por defecto (coche)
  // "/moto": "/planosGLb/lamborghini_sc20.glb", // Moto convencional
  // "/emoto": "/planosGLb/s2.glb", // Moto eléctrica
  // "/ecar": "/planosGLb/i8.glb", // Coche eléctrico
  // "/epatinete": "/planosGLb/patinete.glb", // Patinete eléctrico
  // "/code": "/planosGLb/robo.glb", // Para la sección de códigos
}

// Ajustes específicos para cada modelo
// const MODEL_SETTINGS = {
//   "/": { position: [0, -2.5, 0], scale: 1, rotation: Math.PI / 1 }, // Coche por defecto
//   "/moto": { position: [0, -16, 0], scale: 1, rotation: Math.PI / 2 }, // Moto
//   "/emoto": { position: [0, -2, 0], scale: 2.2, rotation: Math.PI / 4 }, // Moto eléctrica
//   "/ecar": { position: [0, 0, 0], scale: 1, rotation: Math.PI / 1 }, // Coche eléctrico
//   "/epatinete": { position: [0, -1.5, 0], scale: 1.8, rotation: Math.PI / 4 }, // Patinete
//   "/code": { position: [0, -2, 0], scale: 2.0, rotation: Math.PI / 4 }, // Robot para códigos
// }

export default function Scene() {
  const [cameraPosition, setCameraPosition] = useState([5, 2, 5])
  const location = useLocation()
  const [currentModel, setCurrentModel] = useState(MODEL_MAPPING["/"]) // Modelo por defecto
  // const [modelSettings, setModelSettings] = useState(MODEL_SETTINGS["/"]) // Ajustes por defecto

  // Actualizar la posición de la cámara según el tamaño de la pantalla
  useEffect(() => {
    const updateCameraPosition = () => {
      if (window.innerWidth <= 768) {
        setCameraPosition([4, 3, 5]) // Posición de la cámara para pantallas pequeñas
      } else {
        setCameraPosition([5, 0, 5]) // Posición de la cámara para pantallas grandes
      }
    }

    updateCameraPosition()
    window.addEventListener("resize", updateCameraPosition)

    return () => {
      window.removeEventListener("resize", updateCameraPosition)
    }
  }, [])

  // Actualizar el modelo según la ruta actual
  useEffect(() => {
    const path = location.pathname
    const modelUrl = MODEL_MAPPING[path] || MODEL_MAPPING["/"]
    // const settings = MODEL_SETTINGS[path] || MODEL_SETTINGS["/"]

    setCurrentModel(modelUrl)
    // setModelSettings(settings)

    // Opcional: Añadir una animación de transición al cambiar de modelo
    const sceneContainer = document.querySelector(".scene-container")
    if (sceneContainer) {
      sceneContainer.classList.add("model-transition")
      setTimeout(() => {
        sceneContainer.classList.remove("model-transition")
      }, 1000)
    }
  }, [location])

  return (
    <div className="scene-container">
      <Canvas camera={{ position: cameraPosition }} style={{ width: "100%", height: "100%" }}>
        <Suspense fallback={null}>
        <CarModel
             key={currentModel} // fuerza desmontaje y nuevo montaje
             url={currentModel}
            //  position={modelSettings.position}
            //  scale={modelSettings.scale}
            //  rotation={modelSettings.rotation}
        />


          {/* Iluminación mejorada */}
          <Environment preset="city" />
        </Suspense>

        {/* Iluminación básica */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} color="#ffffff" />
        <directionalLight position={[-10, 10, 5]} intensity={1.0} color="#ffffff" />
        <hemisphereLight intensity={0.5} color="#88ccff" groundColor="#8844aa" />

        {/* Controles de la cámara */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={9} // Mínimo acercamiento
          maxDistance={9} // Máxima distancia
          minPolarAngle={Math.PI / 2} // Límite hacia abajo
          maxPolarAngle={Math.PI / 2} // Límite hacia arriba
          autoRotate={false} // Rotación automática
          autoRotateSpeed={0.5} // Velocidad de rotación
        />
      </Canvas>
    </div>
  )
}
