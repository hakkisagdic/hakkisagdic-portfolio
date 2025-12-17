import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Admin kullanıcı oluştur
  const hashedPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@hakkisagdic.dev" },
    update: {},
    create: {
      email: "admin@hakkisagdic.dev",
      password: hashedPassword,
      name: "Hakkı Sağdıç",
      role: "admin",
    },
  });

  console.log("✅ Admin user created:", admin.email);

  // Default settings oluştur
  const settings = await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      siteTitle: "Hakkı Sağdıç",
      siteDescription: "AI Engineer & DevOps Specialist Portfolio",
      theme: "cyberpunk",
      primaryColor: "#00f0ff",
      accentColor: "#f000ff",
      showParticles: true,
      showGrid: true,
      showScanlines: true,
      particleCount: 100,
      animationSpeed: 1.0,
    },
  });

  console.log("✅ Default settings created");

  // Default profile oluştur
  const profile = await prisma.profile.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      name: "Hakkı Sağdıç",
      headline: "AI Engineer & DevOps Specialist",
      summary: "AI Engineer specializing in LLMs, ML pipelines, and intelligent automation. DevOps expert with Docker, Kubernetes, Azure, and cloud-native solutions.",
      location: "Istanbul, Turkey",
      email: "hakki@hakkisagdic.dev",
      linkedin: "https://linkedin.com/in/hakkisagdic",
      github: "https://github.com/hakkisagdic",
    },
  });

  console.log("✅ Default profile created");

  // Highlights (About section cards) - AI focused
  const highlights = [
    {
      id: "hl1",
      icon: "Brain",
      title: "AI & Machine Learning",
      description: "Building intelligent systems with LLMs, ML pipelines, and AI-powered automation",
      order: 0,
    },
    {
      id: "hl2",
      icon: "Bot",
      title: "AI Engineering",
      description: "Developing AI agents, chatbots, and generative AI applications with modern frameworks",
      order: 1,
    },
    {
      id: "hl3",
      icon: "Cloud",
      title: "Cloud Architecture",
      description: "Azure & multi-cloud specialist designing scalable AI-ready infrastructure",
      order: 2,
    },
    {
      id: "hl4",
      icon: "Workflow",
      title: "DevOps & CI/CD",
      description: "Automated pipelines with GitHub Actions, Docker Swarm, and Kubernetes",
      order: 3,
    },
    {
      id: "hl5",
      icon: "Code",
      title: "Software Development",
      description: "Full-stack development with Python, TypeScript, Go, and modern frameworks",
      order: 4,
    },
    {
      id: "hl6",
      icon: "Shield",
      title: "Security & Infrastructure",
      description: "Zero-trust architecture, IaC with Terraform, and compliance automation",
      order: 5,
    },
  ];

  for (const hl of highlights) {
    await prisma.highlight.upsert({
      where: { id: hl.id },
      update: {
        icon: hl.icon,
        title: hl.title,
        description: hl.description,
        order: hl.order,
      },
      create: hl,
    });
  }

  console.log("✅ Highlights created/updated");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
