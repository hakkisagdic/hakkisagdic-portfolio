"use client";

import { motion } from "framer-motion";
import { GlitchText, TypeWriter, Button } from "@/components/ui";
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react";

const roles = [
  "DevOps Engineer",
  "Cloud Architect", 
  "Infrastructure Specialist",
  "Docker & Kubernetes Expert",
];

export function HeroSection() {
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
            text="HAKKI SAĞDIÇ" 
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
          Building resilient infrastructure and automating everything. 
          Specialized in Docker Swarm, Kubernetes, Azure, and cloud-native solutions.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-4 justify-center mb-12"
        >
          <Button variant="primary" size="lg">
            View Projects
          </Button>
          <Button variant="accent" size="lg">
            Contact Me
          </Button>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex gap-6 justify-center"
        >
          <a
            href="https://github.com/hakkisagdic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          >
            <Github size={24} />
          </a>
          <a
            href="https://linkedin.com/in/hakkisagdic"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          >
            <Linkedin size={24} />
          </a>
          <a
            href="mailto:hakkisagdic@gmail.com"
            className="text-text-muted hover:text-primary transition-colors duration-300 hover:drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"
          >
            <Mail size={24} />
          </a>
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
