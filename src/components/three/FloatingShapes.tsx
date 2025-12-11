"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Edges } from "@react-three/drei";
import * as THREE from "three";

// Floating wireframe icosahedron
function FloatingIcosahedron({ position, scale = 1, speed = 1, color = "#00f0ff" }: {
  position: [number, number, number];
  scale?: number;
  speed?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * speed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * speed;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.6} />
        <Edges scale={1.01} threshold={15} color={color} />
      </mesh>
    </Float>
  );
}

// Floating torus with glow effect
function FloatingTorus({ position, scale = 1, color = "#f000ff" }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.4;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.2;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 32]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
      </mesh>
    </Float>
  );
}

// Octahedron with edges
function FloatingOctahedron({ position, scale = 1, color = "#7000ff" }: {
  position: [number, number, number];
  scale?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={1.2}>
      <mesh ref={meshRef} position={position} scale={scale}>
        <octahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.4} />
        <Edges scale={1.01} color={color} />
      </mesh>
    </Float>
  );
}

// Distorted sphere (organic feel)
function DistortedSphere({ position, scale = 1 }: {
  position: [number, number, number];
  scale?: number;
}) {
  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
      <mesh position={position} scale={scale}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          color="#00f0ff"
          wireframe
          transparent
          opacity={0.3}
          distort={0.4}
          speed={2}
        />
      </mesh>
    </Float>
  );
}

// Main component combining all floating shapes
function FloatingShapesScene() {
  return (
    <>
      {/* Primary shapes - cyan */}
      <FloatingIcosahedron position={[-4, 2, -3]} scale={0.8} color="#00f0ff" />
      <FloatingIcosahedron position={[5, -1, -5]} scale={0.6} speed={0.7} color="#00f0ff" />
      
      {/* Accent shapes - magenta */}
      <FloatingTorus position={[4, 3, -4]} scale={0.5} color="#f000ff" />
      <FloatingTorus position={[-3, -2, -6]} scale={0.4} color="#f000ff" />
      
      {/* Secondary shapes - purple */}
      <FloatingOctahedron position={[-5, 0, -4]} scale={0.5} color="#7000ff" />
      <FloatingOctahedron position={[3, -3, -3]} scale={0.4} color="#7000ff" />
      
      {/* Distorted sphere for organic feel */}
      <DistortedSphere position={[0, 0, -8]} scale={2} />
    </>
  );
}

export function FloatingShapes() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <FloatingShapesScene />
      </Canvas>
    </div>
  );
}
