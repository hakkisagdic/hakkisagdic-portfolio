"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { GlitchText, TypeWriter, Button } from "@/components/ui";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

interface Profile {
  name: string;
  headline: string | null;
  summary: string | null;
  github: string | null;
  linkedin: string | null;
  email: string | null;
}

const defaultRoles = [
  "DevOps Engineer",
  "Cloud Architect",
  "Infrastructure Specialist",
];

export function HeroSection() {
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile:", err));
  }, []);

  // Parse roles from headline (split by | or ,)
  const roles = profile?.headline
    ? profile.headline.split(/[|,]/).map((r) => r.trim()).filter(Boolean).slice(0, 4)
    : defaultRoles;

  const name = profile?.name || "Portfolio";
  const summary = profile?.summary?.split(".").slice(0, 2).join(".") + "." ||
    "Building resilient infrastructure and automating everything.";

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase">
            {"// Hello World"}
          </span>
        </motion.div>

        {/* Name with Glitch Effect */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold mb-6"
        >
          <GlitchText
            text={name.toUpperCase()}
            className="text-text"
            glitchOnHover
            intensity="medium"
          />
        </motion.h1>

        {/* Dynamic Role */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-3xl font-body text-text-muted mb-8 h-10"
        >
          <span className="text-primary">{">"}</span>{" "}
          <TypeWriter 
            texts={roles} 
            speed={80} 
            deleteSpeed={40} 
            pauseTime={2500}
            className="text-text"
          />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-text-muted max-w-2xl mx-auto mb-10 text-lg"
        >
          {summary}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          {profile?.github && (
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <Button variant="primary" size="lg">
                <Github className="mr-2" size={18} />
                View GitHub
              </Button>
            </a>
          )}
          <a href="#contact">
            <Button variant="accent" size="lg">
              Contact Me
            </Button>
          </a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex gap-6 justify-center"
        >
          {profile?.linkedin && (
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            >
              <Linkedin size={24} />
            </a>
          )}
          {profile?.email && (
            <a
              href={`mailto:${profile.email}`}
              className="text-text-muted hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            >
              <Mail size={24} />
            </a>
          )}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-primary/50"
        >
          <ArrowDown size={24} />
        </motion.div>
      </motion.div>
    </section>
  );
}
