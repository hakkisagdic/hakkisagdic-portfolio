"use client";

import { forwardRef, HTMLAttributes } from "react";
import { clsx } from "clsx";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "glow" | "accent";
  hoverable?: boolean;
  noPadding?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", hoverable = true, noPadding = false, children, ...props }, ref) => {
    const baseStyles = `
      relative rounded-lg
      bg-surface/80 backdrop-blur-sm
      border border-primary/20
      transition-all duration-300
      overflow-hidden
    `;

    const variants = {
      default: "",
      glow: "shadow-neon-cyan",
      accent: "border-accent/20 hover:border-accent/50",
    };

    const hoverStyles = hoverable
      ? `
        hover:border-primary/50
        hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]
        hover:translate-y-[-2px]
      `
      : "";

    const paddingStyles = noPadding ? "" : "p-6";

    return (
      <div
        ref={ref}
        className={clsx(baseStyles, variants[variant], hoverStyles, paddingStyles, className)}
        {...props}
      >
        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/50" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-primary/50" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-primary/50" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/50" />
        
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";

export const CardHeader = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("mb-4", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
  <h3 className={clsx("font-heading text-xl text-primary", className)} {...props}>
    {children}
  </h3>
);

export const CardDescription = ({ className, children, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
  <p className={clsx("text-gray-400 text-sm mt-1", className)} {...props}>
    {children}
  </p>
);

export const CardContent = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("", className)} {...props}>
    {children}
  </div>
);

export const CardFooter = ({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={clsx("mt-4 pt-4 border-t border-primary/10", className)} {...props}>
    {children}
  </div>
);
