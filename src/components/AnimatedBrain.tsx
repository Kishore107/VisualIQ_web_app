import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, MeshDistortMaterial } from '@react-three/drei';
import { motion as framerMotion } from 'framer-motion';
import { motion as motion3d } from 'framer-motion-3d';
import * as THREE from 'three';

function BrainMesh() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.Material>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
      if (materialRef.current) {
        (materialRef.current as any).distort = Math.sin(state.clock.getElapsedTime()) * 0.3;
      }
    }
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.6}
      floatIntensity={0.6}
    >
      <motion3d.mesh
        ref={meshRef}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, type: "spring" }}
        whileHover={{ scale: 1.1 }}
      >
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#3B82F6"
          wireframe
          transparent
          opacity={0.8}
          distort={0.4}
          speed={5}
          metalness={0.8}
          roughness={0.2}
        />
      </motion3d.mesh>
    </Float>
  );
}

export function AnimatedBrain() {
  return (
    <framerMotion.div 
      className="h-32 w-32 cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
    >
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <spotLight position={[-10, -10, -10]} intensity={0.5} />
        <BrainMesh />
        <OrbitControls 
          enableZoom={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={1}
        />
      </Canvas>
    </framerMotion.div>
  );
} 