"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { Calendar, MapPin } from "lucide-react";

// Placeholder data - will be fetched from DB
const experiences = [
  {
    id: "1",
    title: "Senior DevOps Engineer",
    company: "TechCorp",
    location: "Istanbul, Turkey",
    startDate: "2022-01",
    endDate: null,
    current: true,
    description: `
      Leading infrastructure modernization initiatives and implementing GitOps workflows.
      • Migrated legacy applications to containerized microservices on Docker Swarm
      • Designed and implemented multi-environment CI/CD pipelines with GitHub Actions
      • Reduced deployment time from 2 hours to 15 minutes through automation
      • Implemented comprehensive monitoring with Prometheus, Grafana, and Loki
    `,
    logo: null,
  },
  {
    id: "2",
    title: "DevOps Engineer",
    company: "CloudSoft",
    location: "Istanbul, Turkey",
    startDate: "2020-03",
    endDate: "2021-12",
    current: false,
    description: `
      Built and maintained cloud infrastructure on Azure for SaaS products.
      • Architected Kubernetes clusters for production workloads
      • Implemented infrastructure as code with Terraform and Bicep
      • Set up disaster recovery and backup solutions
      • Automated security compliance checks and vulnerability scanning
    `,
    logo: null,
  },
  {
    id: "3",
    title: "System Administrator",
    company: "DataCenter Inc",
    location: "Ankara, Turkey",
    startDate: "2018-06",
    endDate: "2020-02",
    current: false,
    description: `
      Managed on-premise and hybrid infrastructure for enterprise clients.
      • Administered Linux and Windows server environments
      • Implemented centralized logging and monitoring solutions
      • Managed network infrastructure including firewalls and VPNs
      • Developed automation scripts for routine maintenance tasks
    `,
    logo: null,
  },
];

function formatDate(dateString: string | null): string {
  if (!dateString) return "Present";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export function ExperienceSection() {
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
              <Card className="relative">
                {/* Current Badge */}
                {exp.current && (
                  <span className="absolute -top-3 right-4 px-3 py-1 text-xs font-mono bg-primary text-background rounded">
                    CURRENT
                  </span>
                )}

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
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {exp.location}
                  </span>
                </div>

                {/* Description */}
                <div className="text-text-muted text-sm whitespace-pre-line">
                  {exp.description.trim()}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
