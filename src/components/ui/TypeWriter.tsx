"use client";

import { useState, useEffect } from "react";
import { clsx } from "clsx";

interface TypeWriterProps {
  texts: string[];
  speed?: number;
  deleteSpeed?: number;
  pauseTime?: number;
  className?: string;
  cursorClassName?: string;
  loop?: boolean;
}

export function TypeWriter({
  texts,
  speed = 100,
  deleteSpeed = 50,
  pauseTime = 2000,
  className,
  cursorClassName,
  loop = true,
}: TypeWriterProps) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const currentText = texts[textIndex];

    if (isPaused) {
      const timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    if (isDeleting) {
      if (displayText === "") {
        setIsDeleting(false);
        if (loop || textIndex < texts.length - 1) {
          setTextIndex((prev) => (prev + 1) % texts.length);
        }
        return;
      }

      const timeout = setTimeout(() => {
        setDisplayText((prev) => prev.slice(0, -1));
      }, deleteSpeed);
      return () => clearTimeout(timeout);
    }

    if (displayText === currentText) {
      if (loop || textIndex < texts.length - 1) {
        setIsPaused(true);
      }
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(currentText.slice(0, displayText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, textIndex, isDeleting, isPaused, texts, speed, deleteSpeed, pauseTime, loop]);

  return (
    <span className={clsx("inline-flex items-center", className)}>
      <span>{displayText}</span>
      <span
        className={clsx(
          "inline-block w-[3px] h-[1em] ml-1 bg-primary animate-blink",
          cursorClassName
        )}
      />
    </span>
  );
}

// Simpler version - single text, no deletion
interface TypeWriterSingleProps {
  text: string;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export function TypeWriterSingle({
  text,
  speed = 50,
  className,
  onComplete,
}: TypeWriterSingleProps) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (displayText.length === text.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(text.slice(0, displayText.length + 1));
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, text, speed, onComplete]);

  return (
    <span className={clsx("inline-flex items-center", className)}>
      <span>{displayText}</span>
      {!isComplete && (
        <span className="inline-block w-[3px] h-[1em] ml-1 bg-primary animate-blink" />
      )}
    </span>
  );
}
