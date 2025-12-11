"use client";

import { HTMLAttributes, useState } from "react";
import { clsx } from "clsx";

interface GlitchTextProps extends HTMLAttributes<HTMLSpanElement> {
  text: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
  glitchOnHover?: boolean;
  intensity?: "low" | "medium" | "high";
}

export function GlitchText({
  text,
  as: Component = "span",
  className,
  glitchOnHover = true,
  intensity = "medium",
  ...props
}: GlitchTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  const intensityClasses = {
    low: "hover:[&::before]:animate-[glitch-anim_3s_infinite]",
    medium: "hover:[&::before]:animate-[glitch-anim_1s_infinite]",
    high: "hover:[&::before]:animate-[glitch-anim_0.5s_infinite]",
  };

  const baseStyles = `
    relative inline-block
    text-inherit
  `;

  // CSS for glitch effect
  const glitchStyles = glitchOnHover
    ? `
      [&::before]:content-[attr(data-text)]
      [&::before]:absolute
      [&::before]:top-0
      [&::before]:left-0
      [&::before]:w-full
      [&::before]:h-full
      [&::before]:opacity-0
      hover:[&::before]:opacity-100
      [&::before]:text-accent
      [&::before]:animate-none
      ${intensityClasses[intensity]}
      
      [&::after]:content-[attr(data-text)]
      [&::after]:absolute
      [&::after]:top-0
      [&::after]:left-0
      [&::after]:w-full
      [&::after]:h-full
      [&::after]:opacity-0
      hover:[&::after]:opacity-100
      [&::after]:text-primary
      [&::after]:animate-none
      hover:[&::after]:animate-[glitch-anim2_1s_infinite]
    `
    : "";

  return (
    <Component
      className={clsx(baseStyles, glitchStyles, className)}
      data-text={text}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      {...props}
    >
      {text}
      
      {/* Alternative: Simple RGB split on hover */}
      {isHovered && glitchOnHover && (
        <>
          <span
            className="absolute top-0 left-[2px] w-full h-full text-accent opacity-70 mix-blend-multiply"
            style={{ clipPath: "inset(0 0 50% 0)" }}
            aria-hidden="true"
          >
            {text}
          </span>
          <span
            className="absolute top-0 left-[-2px] w-full h-full text-primary opacity-70 mix-blend-multiply"
            style={{ clipPath: "inset(50% 0 0 0)" }}
            aria-hidden="true"
          >
            {text}
          </span>
        </>
      )}
    </Component>
  );
}

// Simple glitch text without state (pure CSS)
export function GlitchTextCSS({ text, className }: { text: string; className?: string }) {
  return (
    <span className={clsx("glitch", className)} data-text={text}>
      {text}
    </span>
  );
}
