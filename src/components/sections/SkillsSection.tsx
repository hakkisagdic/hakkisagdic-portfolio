"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
}

interface SkillCategory {
  name: string;
  color: string;
  skills: string[];
}

// Color mapping for categories
const categoryColors: Record<string, string> = {
  "General": "#00f0ff",
  "Container & Orchestration": "#00f0ff",
  "Cloud Platforms": "#f000ff",
  "Cloud": "#f000ff",
  "Infrastructure as Code": "#7000ff",
  "CI/CD & Automation": "#00ff9f",
  "DevOps": "#00ff9f",
  "Monitoring & Logging": "#ff9f00",
  "Development": "#00f0ff",
  "Languages": "#f000ff",
  "Frameworks": "#7000ff",
  "Tools": "#ff9f00",
  "Database": "#00ff9f",
  "Testing": "#f000ff",
};

function getColorForCategory(category: string): string {
  return categoryColors[category] || "#00f0ff";
}

// Auto-categorize skills based on keywords
function categorizeSkill(skillName: string): string {
  const name = skillName.toLowerCase();

  if (['azure', 'aws', 'cloud', 'bulut'].some(k => name.includes(k))) return "Cloud";
  if (['docker', 'kubernetes', 'k8s', 'container', 'openshift'].some(k => name.includes(k))) return "DevOps";
  if (['ci/cd', 'jenkins', 'github', 'gitlab', 'bitbucket', 'devops', 'sonarqube'].some(k => name.includes(k))) return "DevOps";
  if (['c#', 'javascript', 'python', 'java', 'typescript', 'go', 'php', 'sql'].some(k => name.includes(k))) return "Languages";
  if (['react', 'angular', 'vue', '.net', 'asp.net', 'entity framework', 'node'].some(k => name.includes(k))) return "Frameworks";
  if (['test', 'unit', 'xunit', 'nunit', 'selenium'].some(k => name.includes(k))) return "Testing";
  if (['jira', 'confluence', 'trello', 'git', 'agile', 'scrum'].some(k => name.includes(k))) return "Tools";
  if (['sql server', 'postgresql', 'mongodb', 'redis', 'elasticsearch'].some(k => name.includes(k))) return "Database";

  return "General";
}

export function SkillsSection() {
  const [skillCategories, setSkillCategories] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data: Skill[]) => {
        // Group skills by category (auto-categorize if "General")
        const grouped: Record<string, string[]> = {};

        data.forEach((skill) => {
          const category = skill.category === "General"
            ? categorizeSkill(skill.name)
            : skill.category;

          if (!grouped[category]) grouped[category] = [];
          if (!grouped[category].includes(skill.name)) {
            grouped[category].push(skill.name);
          }
        });

        // Convert to SkillCategory array and sort
        const categories: SkillCategory[] = Object.entries(grouped)
          .map(([name, skills]) => ({
            name,
            color: getColorForCategory(name),
            skills: skills.sort(),
          }))
          .sort((a, b) => b.skills.length - a.skills.length);

        setSkillCategories(categories);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch skills:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <section id="skills" className="py-24 px-6 bg-surface/30">
        <div className="max-w-6xl mx-auto text-center">
          <div className="animate-pulse text-primary">Loading skills...</div>
        </div>
      </section>
    );
  }

  if (skillCategories.length === 0) {
    return null;
  }

  return (
    <section id="skills" className="py-24 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
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

        {/* Skills as Tags */}
        <div className="space-y-8">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
            >
              <h3
                className="font-heading text-lg mb-4 flex items-center gap-2"
                style={{ color: category.color }}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
                <span className="text-text-muted text-sm font-normal">
                  ({category.skills.length})
                </span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.skills.map((skill, skillIndex) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.3,
                      delay: categoryIndex * 0.1 + skillIndex * 0.02
                    }}
                    className="px-3 py-1.5 text-sm rounded-full border transition-all duration-300 hover:scale-105 cursor-default"
                    style={{
                      borderColor: `${category.color}40`,
                      backgroundColor: `${category.color}10`,
                      color: category.color,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = `${category.color}30`;
                      e.currentTarget.style.boxShadow = `0 0 15px ${category.color}30`;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = `${category.color}10`;
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
