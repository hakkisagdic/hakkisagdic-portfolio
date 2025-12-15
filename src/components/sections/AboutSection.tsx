"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import {
  Terminal,
  Cloud,
  Container,
  Database,
  GitBranch,
  Shield,
  Server,
  Globe,
  Code,
  Cpu,
  HardDrive,
  Lock,
  Layers,
  Network,
  Wifi,
  Zap,
  Settings,
  Rocket,
  Award,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";

interface Profile {
  summary: string | null;
}

interface Highlight {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
}

// Map icon names to actual components
const iconMap: Record<string, LucideIcon> = {
  Container,
  Cloud,
  GitBranch,
  Database,
  Terminal,
  Shield,
  Server,
  Globe,
  Code,
  Cpu,
  HardDrive,
  Lock,
  Layers,
  Network,
  Wifi,
  Zap,
  Settings,
  Rocket,
  Award,
  CheckCircle,
};

export function AboutSection() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data))
      .catch((err) => console.error("Failed to fetch profile:", err));

    fetch("/api/highlights")
      .then((res) => res.json())
      .then((data) => setHighlights(Array.isArray(data) ? data : []))
      .catch((err) => console.error("Failed to fetch highlights:", err));
  }, []);

  // Split summary into intro and detail paragraphs
  const summaryText = profile?.summary || "";
  const sentences = summaryText.split(/(?<=[.!?])\s+/).filter(Boolean);
  const introParagraph = sentences.slice(0, 2).join(" ") ||
    "A passionate engineer building robust infrastructure and automating complex workflows.";
  const detailParagraph = sentences.slice(2).join(" ") || "";

  return (
    <section id="about" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase">
            {"// About Me"}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Who I <span className="text-gradient">Am</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            {introParagraph}
          </p>
        </motion.div>

        {/* Bio */}
        {detailParagraph && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-16"
          >
            <Card className="max-w-3xl mx-auto">
              <div className="prose prose-invert max-w-none">
                <p className="text-text-muted leading-relaxed">
                  {detailParagraph}
                </p>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Highlights Grid */}
        {highlights.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlights.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Container;
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <Card className="h-full group">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                        <IconComponent size={24} />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg text-text mb-2">
                          {item.title}
                        </h3>
                        <p className="text-text-muted text-sm">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
