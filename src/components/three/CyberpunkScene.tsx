"use client";

import { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  Float, 
  Points, 
  PointMaterial, 
  Edges
} from "@react-three/drei";
import * as THREE from "three";

// ============================================================================
// PARTICLES
// ============================================================================

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

function Particles() {
  const primaryRef = useRef<THREE.Points>(null);
  const secondaryRef = useRef<THREE.Points>(null);
  
  const primaryPositions = useMemo(() => generateSpherePoints(5000, 12), []);
  const secondaryPositions = useMemo(() => generateSpherePoints(2000, 18), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (primaryRef.current) {
      primaryRef.current.rotation.x = t * 0.02;
      primaryRef.current.rotation.y = t * 0.03;
    }
    if (secondaryRef.current) {
      secondaryRef.current.rotation.x = -t * 0.01;
      secondaryRef.current.rotation.y = -t * 0.02;
    }
  });

  return (
    <>
      <Points ref={primaryRef} positions={primaryPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#00f0ff"
          size={0.015}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </Points>
      <Points ref={secondaryRef} positions={secondaryPositions} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#f000ff"
          size={0.008}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.6}
        />
      </Points>
    </>
  );
}

// ============================================================================
// GRID FLOOR
// ============================================================================

function GridFloor() {
  const gridRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (gridRef.current) {
      gridRef.current.position.z = (state.clock.elapsedTime * 0.5) % 2;
    }
  });

  return (
    <group ref={gridRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
      <gridHelper args={[60, 60, "#00f0ff", "#00f0ff"]} material-opacity={0.15} material-transparent />
      <gridHelper args={[60, 30, "#f000ff", "#f000ff"]} material-opacity={0.05} material-transparent />
    </group>
  );
}

// ============================================================================
// FLOATING GEOMETRY
// ============================================================================

function FloatingGeo({ 
  position, 
  geometry, 
  color, 
  scale = 1,
  rotationSpeed = 1 
}: {
  position: [number, number, number];
  geometry: "icosahedron" | "octahedron" | "torus" | "dodecahedron";
  color: string;
  scale?: number;
  rotationSpeed?: number;
}) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.3 * rotationSpeed;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2 * rotationSpeed;
    }
  });

  const GeoComponent = {
    icosahedron: <icosahedronGeometry args={[1, 0]} />,
    octahedron: <octahedronGeometry args={[1, 0]} />,
    torus: <torusGeometry args={[1, 0.3, 8, 24]} />,
    dodecahedron: <dodecahedronGeometry args={[1, 0]} />,
  };

  return (
    <Float speed={2} rotationIntensity={0.3} floatIntensity={1}>
      <mesh ref={meshRef} position={position} scale={scale}>
        {GeoComponent[geometry]}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.5} />
        <Edges scale={1.01} color={color} />
      </mesh>
    </Float>
  );
}

// ============================================================================
// SCENE COMPOSITION
// ============================================================================

function Scene() {
  const { mouse } = useThree();
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (groupRef.current) {
      // Subtle parallax effect based on mouse
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        mouse.x * 0.1,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        mouse.y * 0.05,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef}>
      {/* Particles */}
      <Particles />
      
      {/* Grid Floor */}
      <GridFloor />
      
      {/* Floating Shapes */}
      <FloatingGeo position={[-5, 2, -4]} geometry="icosahedron" color="#00f0ff" scale={0.8} />
      <FloatingGeo position={[5, 1, -5]} geometry="icosahedron" color="#00f0ff" scale={0.6} rotationSpeed={0.7} />
      <FloatingGeo position={[4, 3, -6]} geometry="torus" color="#f000ff" scale={0.5} />
      <FloatingGeo position={[-4, -1, -5]} geometry="torus" color="#f000ff" scale={0.4} />
      <FloatingGeo position={[-6, 0, -7]} geometry="octahedron" color="#7000ff" scale={0.5} />
      <FloatingGeo position={[6, -2, -4]} geometry="dodecahedron" color="#7000ff" scale={0.4} />
    </group>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

interface CyberpunkSceneProps {
  className?: string;
}

export function CyberpunkScene({ className }: CyberpunkSceneProps) {
  return (
    <div className={`fixed inset-0 -z-10 ${className || ""}`}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: "high-performance"
        }}
      >
        <Suspense fallback={null}>
          <fog attach="fog" args={["#0a0a0f", 8, 30]} />
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
