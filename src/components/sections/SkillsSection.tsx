"use client";

import { motion } from "framer-motion";

interface SkillCategory {
  name: string;
  color: string;
  skills: { name: string; level: number }[];
}

const skillCategories: SkillCategory[] = [
  {
    name: "Container & Orchestration",
    color: "#00f0ff",
    skills: [
      { name: "Docker", level: 95 },
      { name: "Docker Swarm", level: 95 },
      { name: "Kubernetes", level: 85 },
      { name: "Portainer", level: 90 },
      { name: "Traefik", level: 90 },
    ],
  },
  {
    name: "Cloud Platforms",
    color: "#f000ff",
    skills: [
      { name: "Microsoft Azure", level: 90 },
      { name: "Azure DevOps", level: 85 },
      { name: "AWS", level: 70 },
      { name: "Cloudflare", level: 85 },
    ],
  },
  {
    name: "Infrastructure as Code",
    color: "#7000ff",
    skills: [
      { name: "Terraform", level: 85 },
      { name: "Bicep", level: 80 },
      { name: "ARM Templates", level: 75 },
      { name: "Ansible", level: 70 },
    ],
  },
  {
    name: "CI/CD & Automation",
    color: "#00ff9f",
    skills: [
      { name: "GitHub Actions", level: 90 },
      { name: "Azure Pipelines", level: 85 },
      { name: "GitLab CI", level: 80 },
      { name: "Shell Scripting", level: 90 },
    ],
  },
  {
    name: "Monitoring & Logging",
    color: "#ff9f00",
    skills: [
      { name: "Prometheus", level: 85 },
      { name: "Grafana", level: 90 },
      { name: "Loki", level: 80 },
      { name: "ELK Stack", level: 75 },
    ],
  },
  {
    name: "Development",
    color: "#00f0ff",
    skills: [
      { name: "Python", level: 80 },
      { name: "Go", level: 65 },
      { name: "Node.js", level: 75 },
      { name: "PostgreSQL", level: 85 },
    ],
  },
];

function SkillBar({ name, level, color, delay }: { 
  name: string; 
  level: number; 
  color: string;
  delay: number;
}) {
  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="text-text text-sm font-medium">{name}</span>
        <span className="text-text-muted text-sm">{level}%</span>
      </div>
      <div className="h-2 bg-surface-light rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}50`
          }}
        />
      </div>
    </div>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="py-24 px-6 bg-surface/30">
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
            {"// Technical Skills"}
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold mt-4 mb-6">
            My <span className="text-gradient">Arsenal</span>
          </h2>
          <p className="text-text-muted max-w-2xl mx-auto text-lg">
            Technologies and tools I use to build reliable, scalable infrastructure
          </p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="bg-surface/50 backdrop-blur-sm border border-primary/10 rounded-lg p-6 hover:border-primary/30 transition-colors duration-300"
            >
              <h3 
                className="font-heading text-lg mb-6 pb-2 border-b"
                style={{ 
                  color: category.color,
                  borderColor: `${category.color}30`
                }}
              >
                {category.name}
              </h3>
              {category.skills.map((skill, skillIndex) => (
                <SkillBar
                  key={skill.name}
                  name={skill.name}
                  level={skill.level}
                  color={category.color}
                  delay={categoryIndex * 0.1 + skillIndex * 0.05}
                />
              ))}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
