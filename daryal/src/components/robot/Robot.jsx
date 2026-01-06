import React, { Suspense, useEffect, useState, Component } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useAnimations } from '@react-three/drei';

class WebGLErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return this.props.fallback || null;
        }
        return this.props.children;
    }
}

function Model() {
    const { scene, animations } = useGLTF("/planosGLb/futur.glb");
    const { actions } = useAnimations(animations, scene);

    useEffect(() => {
        if (actions) {
            const firstAnimation = Object.keys(actions)[0];
            if (firstAnimation) actions[firstAnimation].play();
        }
    }, [actions]);

    return <primitive object={scene} scale={[3, 3, 3]} />;
}

function checkWebGLSupport() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
    } catch (e) {
        return false;
    }
}

export default function RobotComponent() {
    const [webGLSupported, setWebGLSupported] = useState(true);

    useEffect(() => {
        setWebGLSupported(checkWebGLSupport());
    }, []);

    if (!webGLSupported) {
        return (
            <div className="robot-fixed-container">
                <div className="robot-placeholder"></div>
            </div>
        );
    }

    return (
        <div className="robot-fixed-container">
            <WebGLErrorBoundary fallback={<div className="robot-placeholder"></div>}>
                <Canvas
                    camera={{ position: [-6, 0, 12], fov: 30 }}
                    gl={{ alpha: true, antialias: true }}
                    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                >
                    <ambientLight intensity={1} />
                    <directionalLight intensity={1.5} position={[5, 5, 5]} />
                    <Suspense fallback={null}>
                        <Model />
                    </Suspense>
                    <OrbitControls target={[0, 0, 0]} enableZoom={false} />
                </Canvas>
            </WebGLErrorBoundary>
        </div>
    );
}
