"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

// Generate random points in a sphere
function generateSpherePoints(count: number, radius: number): Float32Array {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = Math.cbrt(Math.random()) * radius;
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  
  return positions;
}

interface ParticleFieldProps {
  count?: number;
  radius?: number;
  color?: string;
  size?: number;
  speed?: number;
}

function ParticleFieldInner({
  count = 5000,
  radius = 10,
  color = "#00f0ff",
  size = 0.015,
  speed = 0.2,
}: ParticleFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  
  const positions = useMemo(() => generateSpherePoints(count, radius), [count, radius]);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * speed * 0.1;
      pointsRef.current.rotation.y = state.clock.elapsedTime * speed * 0.15;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color={color}
        size={size}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

// Secondary particle layer for depth
function SecondaryParticles() {
  const pointsRef = useRef<THREE.Points>(null);
  const positions = useMemo(() => generateSpherePoints(2000, 15), []);
  
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = -state.clock.elapsedTime * 0.05;
      pointsRef.current.rotation.y = -state.clock.elapsedTime * 0.08;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#f000ff"
        size={0.01}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        opacity={0.6}
      />
    </Points>
  );
}

export function ParticleField(props: ParticleFieldProps) {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <ParticleFieldInner {...props} />
        <SecondaryParticles />
      </Canvas>
    </div>
  );
}
