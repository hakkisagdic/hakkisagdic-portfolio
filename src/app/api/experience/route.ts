import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - Fetch all experiences (public)
export async function GET() {
  try {
    const experiences = await prisma.experience.findMany({
      orderBy: [
        { current: "desc" },
        { startDate: "desc" },
      ],
    });

    return NextResponse.json(experiences);
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

// POST - Create new experience (admin only)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const experience = await prisma.experience.create({
      data: {
        title: body.title,
        company: body.company,
        logo: body.logo,
        location: body.location,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
        current: body.current || false,
        description: body.description,
        order: body.order || 0,
      },
    });

    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error("Error creating experience:", error);
    return NextResponse.json(
      { error: "Failed to create experience" },
      { status: 500 }
    );
  }
}
