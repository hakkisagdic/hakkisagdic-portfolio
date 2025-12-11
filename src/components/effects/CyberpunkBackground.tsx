"use client";

import { ParticlesCanvas } from "./ParticlesCanvas";
import { NeonGridCanvas } from "./NeonGridCanvas";

interface CyberpunkBackgroundProps {
  showParticles?: boolean;
  showGrid?: boolean;
  showScanlines?: boolean;
  particleCount?: number;
  gridPerspective?: boolean;
}

export function CyberpunkBackground({
  showParticles = true,
  showGrid = true,
  showScanlines = true,
  particleCount = 80,
  gridPerspective = true,
}: CyberpunkBackgroundProps) {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      {/* Base gradient background */}
      <div 
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 50% 0%, rgba(112, 0, 255, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 0% 100%, rgba(0, 240, 255, 0.1) 0%, transparent 40%),
            radial-gradient(ellipse at 100% 100%, rgba(240, 0, 255, 0.1) 0%, transparent 40%),
            linear-gradient(to bottom, #0a0a0f 0%, #0f0f1a 100%)
          `,
        }}
      />

      {/* Neon grid */}
      {showGrid && (
        <NeonGridCanvas 
          perspective={gridPerspective} 
          opacity={0.06}
          color="#00f0ff"
        />
      )}

      {/* Particles */}
      {showParticles && (
        <ParticlesCanvas 
          particleCount={particleCount}
          colors={["#00f0ff", "#f000ff", "#7000ff"]}
          connectDistance={120}
        />
      )}

      {/* Scanlines overlay */}
      {showScanlines && (
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 240, 255, 0.03) 2px,
              rgba(0, 240, 255, 0.03) 4px
            )`,
            zIndex: 10,
          }}
        />
      )}

      {/* Vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 15, 0.4) 100%)`,
          zIndex: 11,
        }}
      />
    </div>
  );
}
