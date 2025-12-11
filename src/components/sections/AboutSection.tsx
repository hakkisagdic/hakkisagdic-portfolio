"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui";
import { Terminal, Cloud, Container, Database, GitBranch, Shield } from "lucide-react";

const highlights = [
  {
    icon: Container,
    title: "Container Orchestration",
    description: "Docker Swarm & Kubernetes expert with enterprise-grade deployments",
  },
  {
    icon: Cloud,
    title: "Cloud Architecture",
    description: "Azure specialist designing scalable, cost-effective infrastructure",
  },
  {
    icon: GitBranch,
    title: "CI/CD Pipelines",
    description: "Automated workflows with GitHub Actions, Azure DevOps, GitLab CI",
  },
  {
    icon: Database,
    title: "Infrastructure as Code",
    description: "Terraform, Bicep, and ARM templates for reproducible environments",
  },
  {
    icon: Terminal,
    title: "Automation",
    description: "Shell scripting, Python, and Go for operational automation",
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Zero-trust architecture, secrets management, compliance automation",
  },
];

export function AboutSection() {
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
            A DevOps engineer passionate about building robust infrastructure and 
            automating complex workflows. I transform manual processes into reliable, 
            scalable systems.
          </p>
        </motion.div>

        {/* Bio */}
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
                With years of experience in enterprise infrastructure, I specialize in 
                designing and implementing cloud-native solutions. My expertise spans 
                container orchestration with Docker Swarm and Kubernetes, cloud services 
                on Azure, and building comprehensive CI/CD pipelines.
              </p>
              <p className="text-text-muted leading-relaxed mt-4">
                I believe in infrastructure as code, GitOps workflows, and the power of 
                automation to reduce toil and increase reliability. Every system I build 
                is designed with monitoring, security, and scalability in mind.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {highlights.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <Card className="h-full group">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-background transition-colors duration-300">
                    <item.icon size={24} />
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
          ))}
        </div>
      </div>
    </section>
  );
}
