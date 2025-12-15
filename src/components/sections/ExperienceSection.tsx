"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { Calendar, MapPin } from "lucide-react";

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string | null;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string | null;
  logo: string | null;
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then((data) => {
        setExperiences(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch experiences:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="experience" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-pulse text-primary">Loading experiences...</div>
        </div>
      </section>
    );
  }

  if (experiences.length === 0) {
    return null;
  }

  return (
    <section id="experience" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="text-primary font-mono text-sm tracking-widest uppercase">
            {"// Work Experience"}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Career <span className="text-gradient">Timeline</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            My professional journey in infrastructure and DevOps
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="timeline-line ml-6" />

          {/* Experience Items */}
          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-16 pb-12 last:pb-0"
            >
              {/* Timeline Dot */}
              <div className="timeline-dot" style={{ top: "8px" }}>
                {exp.current && (
                  <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                )}
              </div>

              {/* Content Card */}
              <div className="relative">
                {/* Current Badge - outside Card to avoid overflow-hidden */}
                {exp.current && (
                  <span className="absolute -top-3 right-4 z-10 px-3 py-1 text-xs font-mono bg-primary text-background rounded">
                    CURRENT
                  </span>
                )}
                <Card className="relative">

                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-heading text-xl text-text">
                    {exp.title}
                  </h3>
                  <p className="text-primary font-medium">{exp.company}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-4 text-text-muted text-sm mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                  {exp.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={14} />
                      {exp.location}
                    </span>
                  )}
                </div>

                {/* Description */}
                {exp.description && (
                  <div className="text-text-muted text-sm whitespace-pre-line">
                    {exp.description.trim()}
                  </div>
                )}
              </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
