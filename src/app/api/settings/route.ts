import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET settings (singleton)
export async function GET() {
  try {
    let settings = await prisma.settings.findFirst();
    
    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.settings.create({
        data: {
          siteTitle: "Portfolio",
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
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// PUT update settings
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    let settings = await prisma.settings.findFirst();

    if (settings) {
      settings = await prisma.settings.update({
        where: { id: settings.id },
        data: body,
      });
    } else {
      settings = await prisma.settings.create({
        data: body,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
