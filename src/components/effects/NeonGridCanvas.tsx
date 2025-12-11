"use client";

import { useEffect, useRef } from "react";

interface NeonGridCanvasProps {
  gridSize?: number;
  color?: string;
  opacity?: number;
  perspective?: boolean;
}

export function NeonGridCanvas({
  gridSize = 50,
  color = "#00f0ff",
  opacity = 0.08,
  perspective = true,
}: NeonGridCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const offsetRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawGrid = () => {
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Animate offset for scrolling effect
      offsetRef.current = (offsetRef.current + 0.5) % gridSize;

      if (perspective) {
        // Perspective grid (horizon effect)
        const horizonY = canvas.height * 0.4;
        const vanishingPointX = canvas.width / 2;

        // Draw horizontal lines with perspective
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;

        for (let i = 0; i <= 20; i++) {
          const y = horizonY + (i * i * 3) + offsetRef.current;
          if (y > canvas.height) continue;

          const perspectiveFactor = (y - horizonY) / (canvas.height - horizonY);
          ctx.globalAlpha = opacity * perspectiveFactor;

          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }

        // Draw vertical lines converging to vanishing point
        const lineCount = 30;
        for (let i = -lineCount; i <= lineCount; i++) {
          const bottomX = vanishingPointX + i * (canvas.width / lineCount) * 1.5;
          
          ctx.globalAlpha = opacity * 0.5;
          ctx.beginPath();
          ctx.moveTo(vanishingPointX, horizonY);
          ctx.lineTo(bottomX, canvas.height);
          ctx.stroke();
        }

        // Glow line at horizon
        ctx.globalAlpha = opacity * 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = color;
        ctx.beginPath();
        ctx.moveTo(0, horizonY);
        ctx.lineTo(canvas.width, horizonY);
        ctx.stroke();
        ctx.shadowBlur = 0;

      } else {
        // Flat grid
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.globalAlpha = opacity;

        // Vertical lines
        for (let x = offsetRef.current; x < canvas.width; x += gridSize) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }

        // Horizontal lines
        for (let y = offsetRef.current; y < canvas.height; y += gridSize) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      animationRef.current = requestAnimationFrame(drawGrid);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    drawGrid();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gridSize, color, opacity, perspective]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
    />
  );
}
