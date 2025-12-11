"use client";

import dynamic from "next/dynamic";
import { Navigation } from "@/components/layout";
import { 
  HeroSection, 
  AboutSection, 
  ExperienceSection, 
  SkillsSection,
  ContactSection 
} from "@/components/sections";

// Dynamic import for 3D scene to avoid SSR issues
const CyberpunkScene = dynamic(
  () => import("@/components/three/CyberpunkScene").then((mod) => mod.CyberpunkScene),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      {/* 3D Background */}
      <CyberpunkScene />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Main Content */}
      <main className="relative z-10">
        <div id="home">
          <HeroSection />
        </div>
        <AboutSection />
        <ExperienceSection />
        <SkillsSection />
        <ContactSection />
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-primary/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-text-muted text-sm">
            <span className="text-primary font-mono">{"<"}</span>
            {" "}Built with Next.js, Three.js & Tailwind CSS{" "}
            <span className="text-primary font-mono">{"/>"}</span>
          </p>
          <p className="text-text-muted/50 text-xs mt-2">
            © {new Date().getFullYear()} Hakkı Sağdıç. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
