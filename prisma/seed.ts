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
      siteDescription: "DevOps Engineer Portfolio",
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
      headline: "DevOps Engineer",
      summary: "Experienced DevOps Engineer specializing in Docker, Kubernetes, Azure, and cloud-native solutions.",
      location: "Istanbul, Turkey",
      email: "hakki@hakkisagdic.dev",
      linkedin: "https://linkedin.com/in/hakkisagdic",
      github: "https://github.com/hakkisagdic",
    },
  });

  console.log("✅ Default profile created");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
