"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { Award, ExternalLink, Calendar } from "lucide-react";

interface Certification {
  id: string;
  name: string;
  issuer: string;
  issueDate: string;
  expireDate: string | null;
  credentialId: string | null;
  url: string | null;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function CertificationsSection() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/certifications")
      .then((res) => res.json())
      .then((data) => {
        setCertifications(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch certifications:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="certifications" className="py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse text-primary">Loading certifications...</div>
        </div>
      </section>
    );
  }

  if (certifications.length === 0) {
    return null;
  }

  return (
    <section id="certifications" className="py-24 px-6 bg-surface/30">
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
            {"// Certifications"}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            Professional <span className="text-gradient">Credentials</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            Industry certifications and professional qualifications
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:border-primary/50 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-background transition-colors duration-300">
                    <Award size={24} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-heading text-lg text-text mb-1 leading-tight">
                      {cert.name}
                    </h3>
                    <p className="text-primary text-sm mb-2">{cert.issuer}</p>
                    <div className="flex items-center gap-1 text-text-muted text-xs mb-2">
                      <Calendar size={12} />
                      <span>
                        {formatDate(cert.issueDate)}
                        {cert.expireDate && ` - ${formatDate(cert.expireDate)}`}
                      </span>
                    </div>
                    {cert.credentialId && (
                      <p className="text-text-muted text-xs">
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>
                </div>
                {cert.url && (
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 flex items-center gap-2 text-primary text-sm hover:underline"
                  >
                    <ExternalLink size={14} />
                    View Credential
                  </a>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
