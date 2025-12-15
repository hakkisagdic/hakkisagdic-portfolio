"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { GraduationCap, Calendar } from "lucide-react";

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string | null;
  startDate: string | null;
  endDate: string | null;
  showDates: boolean;
  description: string | null;
}

function formatYear(dateString: string | null): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

export function EducationSection() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then((data) => {
        setEducation(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch education:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="education" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse text-primary">Loading education...</div>
        </div>
      </section>
    );
  }

  if (education.length === 0) {
    return null;
  }

  return (
    <section id="education" className="py-24 px-6">
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
            {"// Education"}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Academic <span className="text-gradient">Background</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            My educational journey and academic qualifications
          </p>
        </motion.div>

        {/* Education Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, index) => (
            <motion.div
              key={edu.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-primary/50 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                    <GraduationCap size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg text-text mb-1 leading-tight">
                      {edu.degree}
                      {edu.field && ` in ${edu.field}`}
                    </h3>
                    <p className="text-primary text-sm mb-2">{edu.school}</p>
                    {edu.showDates && edu.startDate && (
                      <div className="flex items-center gap-1 text-text-muted text-xs">
                        <Calendar size={12} />
                        <span>
                          {formatYear(edu.startDate)}
                          {edu.endDate && ` - ${formatYear(edu.endDate)}`}
                        </span>
                      </div>
                    )}
                    {edu.description && (
                      <p className="text-text-muted text-sm mt-2">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
