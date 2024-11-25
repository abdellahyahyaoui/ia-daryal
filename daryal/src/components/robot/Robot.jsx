import React, { Suspense, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations, Environment } from '@react-three/drei';
import './Robot.css'
function Model() {
    const { scene, animations } = useGLTF("/planosGLb/futur.glb");
    const { actions } = useAnimations(animations, scene);

    // Inicia la animación automáticamente
    useEffect(() => {
        if (actions) {
            const firstAnimation = Object.keys(actions)[0];
            if (firstAnimation) {
                actions[firstAnimation].play();
            }
        }
    }, [actions]);

    return <primitive object={scene} scale={[1.6, 1.6, 1.6,]} />; // Aumenta la escala del modelo
}

export default function RobotComponent() {
    return (
        <div
            className="robot-component"
           
        >
            <Canvas
                camera={{ position: [1.5, 0, 8], fov: 30 }}
                gl={{ alpha: true, antialias: true }}
            >
                <ambientLight intensity={1} />
                <directionalLight intensity={1.5} position={[5, 5, 5]} />

                <Suspense fallback={null}>
                    <Model />
                    <Environment preset="sunset" />
                </Suspense>

                <OrbitControls target={[0, 0, 0]} enableZoom={false} />
            </Canvas>
        </div>
    );
}
