// // Scene.jsx
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
// import { Suspense } from 'react';
// import './Fond.css';
// import CarModel from '../car-model/CarModel'; // Asegúrate de que la ruta sea correcta


// function Model({ url }) {
//   const { scene } = useGLTF(url);
//     scene.position.set(3, 0.2, -2);
//   return <primitive object={scene} />;
// }

// export default function Scene() {
//   return (
//     <div className="scene-container">
//           <Canvas camera={{ position: [12, 6, 26] }}
//           style={{ width: '100%', height: '100%' }}
//           >
              
//         <Suspense fallback={null}>
//           {/* Carga el modelo del escenario .glb */}
//           <Model url="/planosGLb/7.glb" />
//           {/* Carga el modelo del coche .glb */}
//           {/* <CarModel url="/planosGLb/ferrari_sf90_stradale.glb" /> */}
//           <CarModel url="/planosGLb/cabrio.glb" /> 
//                   <Environment preset="sunset" />
//         </Suspense>

//         {/* Añade iluminación */}
//         <ambientLight intensity={1.0} /> {/* Aumentar la luz ambiental */}
//         <directionalLight position={[10, 10, 5]} intensity={1.0} /> {/* Luz direccional */}
//         <directionalLight position={[-10, 10, 5]} intensity={0.5} /> {/* Otra luz direccional */}
//         <pointLight position={[55, 5, 5]} intensity={1.5} decay={2} distance={10} /> {/* Luz puntual */}

//         {/* Controles de la cámara */}
//         <OrbitControls
//           enableZoom={true}
//           enablePan={true}
//           enableRotate={true}
//           zoomSpeed={0.6}
//           panSpeed={0.5}
//           rotateSpeed={0.4}
//           minDistance={1} // Mínimo acercamiento
//           maxDistance={4} // Máxima distancia
//           minAzimuthAngle={-Math.PI / 0} // Límite izquierda
//           maxAzimuthAngle={Math.PI / 0} // Límite derecha
//           minPolarAngle={Math.PI / 3.2} // Límite hacia abajo
//           maxPolarAngle={Math.PI /2} // Límite hacia arriba
//         />
//       </Canvas>
//     </div>
//   );
// }




import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Environment } from '@react-three/drei';
import { Suspense, useEffect, useState } from 'react';
import './Fond.css';
import CarModel from '../car-model/CarModel'; // Asegúrate de que la ruta sea correcta

function Model({ url }) {
  const { scene } = useGLTF(url);
  scene.position.set(3, 0.2, -2);
  return <primitive object={scene} />;
}

export default function Scene() {
  const [cameraPosition, setCameraPosition] = useState([12, 6, 26]);

  useEffect(() => {
    // Verifica el tamaño de la ventana y ajusta la posición de la cámara para pantallas pequeñas
    const updateCameraPosition = () => {
      if (window.innerWidth <= 768) {
        setCameraPosition([-45, 19, 2]); // Posición de la cámara para pantallas pequeñas
      } else {
        setCameraPosition([12, 10, 26]); // Posición de la cámara para pantallas grandes
      }
    };

    // Llamamos la función al cargar el componente y cada vez que cambia el tamaño de la ventana
    updateCameraPosition();
    window.addEventListener('resize', updateCameraPosition);

    // Cleanup: remover el event listener cuando se desmonte el componente
    return () => {
      window.removeEventListener('resize', updateCameraPosition);
    };
  }, []);

  return (
    <div className="scene-container">
      <Canvas camera={{ position: cameraPosition }} style={{ width: '100%', height: '100%' }}>
        <Suspense fallback={null}>
          {/* Carga el modelo del escenario .glb */}
          <Model url="/planosGLb/nissan.glb" />
          {/* Carga el modelo del coche .glb */}
          {/* <CarModel url="/planosGLb/bmw.glb" /> */}
          {/* <Environment preset="studio" /> */}
        </Suspense>

        {/* Añade iluminación */}
        {/* <ambientLight intensity={1.0} /> Aumentar la luz ambiental */}
        <directionalLight position={[10, 10, 5]} intensity={1.0} /> {/* Luz direccional */}
        <directionalLight position={[-10, 10, 5]} intensity={0.5} /> {/* Otra luz direccional */}
        <pointLight position={[55, 5, 5]} intensity={1.5} decay={2} distance={10} /> {/* Luz puntual */}

        {/* Controles de la cámara */}
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.6}
          panSpeed={0.5}
          rotateSpeed={0.4}
          minDistance={1} // Mínimo acercamiento
          maxDistance={4} // Máxima distancia
          minAzimuthAngle={-Math.PI / 0} // Límite izquierda
          maxAzimuthAngle={Math.PI / 0} // Límite derecha
          minPolarAngle={Math.PI / 3.2} // Límite hacia abajo
          maxPolarAngle={Math.PI / 2} // Límite hacia arriba
        />
      </Canvas>
    </div>
  );
}
