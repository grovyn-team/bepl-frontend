import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function SteelBeam() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.2) * 0.1 + state.clock.elapsedTime * 0.05;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.5}>
      <group ref={meshRef} scale={1.2}>
        {/* Main I-Beam */}
        <group>
          {/* Top flange */}
          <mesh position={[0, 0.45, 0]} castShadow>
            <boxGeometry args={[0.5, 0.08, 3]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Bottom flange */}
          <mesh position={[0, -0.45, 0]} castShadow>
            <boxGeometry args={[0.5, 0.08, 3]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Web */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.06, 0.82, 3]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>

        {/* Secondary beam crossing */}
        <group rotation={[0, Math.PI / 4, 0]} position={[0, 0, 0]}>
          {/* Top flange */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[0.3, 0.05, 2]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Bottom flange */}
          <mesh position={[0, -0.15, 0]} castShadow>
            <boxGeometry args={[0.3, 0.05, 2]} />
            <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.3} />
          </mesh>
          {/* Web */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={[0.04, 0.25, 2]} />
            <meshStandardMaterial color="#a1a1aa" metalness={0.9} roughness={0.25} />
          </mesh>
        </group>

        {/* Accent glow ring */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.8, 0.02, 16, 100]} />
          <meshStandardMaterial 
            color="#f59e0b" 
            emissive="#f59e0b" 
            emissiveIntensity={0.5}
            metalness={1}
            roughness={0.2}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function SteelBeamScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.4} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#f59e0b" />
        <pointLight position={[0, 0, 0]} intensity={0.5} color="#f59e0b" />
        
        <SteelBeam />
        
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
