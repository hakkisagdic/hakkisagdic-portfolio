"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface GridPlaneProps {
  size?: number;
  divisions?: number;
  color?: string;
}

function AnimatedGrid({ 
  size = 30, 
  divisions = 30, 
  color = "#00f0ff",
}: GridPlaneProps) {
  const gridRef = useRef<THREE.GridHelper>(null);

  useFrame((state) => {
    if (gridRef.current) {
      // Subtle wave animation
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % (size / divisions);
    }
  });

  return (
    <group rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <gridHelper
        ref={gridRef}
        args={[size, divisions, color, color]}
      />
      {/* Second grid layer for depth */}
      <gridHelper
        args={[size * 2, divisions * 2, color, color]}
        position={[0, -0.01, 0]}
        material-opacity={0.3}
        material-transparent={true}
      />
    </group>
  );
}

// Horizontal lines moving toward camera (retro effect)
function MovingLines() {
  const groupRef = useRef<THREE.Group>(null);
  const linesRef = useRef<THREE.Line[]>([]);
  
  useFrame((state) => {
    linesRef.current.forEach((line, i) => {
      if (line) {
        line.position.z = ((state.clock.elapsedTime * 2 + i * 2) % 20) - 10;
      }
    });
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 10 }).map((_, i) => (
        <line key={i} ref={(el) => { if (el) linesRef.current[i] = el as unknown as THREE.Line; }}>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[new Float32Array([-15, -2, 0, 15, -2, 0]), 3]}
              count={2}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial 
            color="#00f0ff" 
            transparent 
            opacity={0.5}
          />
        </line>
      ))}
    </group>
  );
}

export function NeonGrid(props: GridPlaneProps) {
  return (
    <div className="fixed inset-0 -z-20">
      <Canvas
        camera={{ position: [0, 2, 8], fov: 60, near: 0.1, far: 100 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={["#0a0a0f", 5, 25]} />
        <AnimatedGrid {...props} />
        <MovingLines />
      </Canvas>
    </div>
  );
}
