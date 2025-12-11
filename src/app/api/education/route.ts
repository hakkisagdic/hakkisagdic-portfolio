import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all education
export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: [{ order: "asc" }, { startDate: "desc" }],
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error("Error fetching education:", error);
    return NextResponse.json({ error: "Failed to fetch education" }, { status: 500 });
  }
}

// POST new education
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { school, degree, field, startDate, endDate, description, order } = body;

    const education = await prisma.education.create({
      data: {
        school,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        description,
        order: order || 0,
      },
    });

    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error("Error creating education:", error);
    return NextResponse.json({ error: "Failed to create education" }, { status: 500 });
  }
}

// PUT update education
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, startDate, endDate, ...rest } = body;

    if (!id) {
      return NextResponse.json({ error: "Education ID required" }, { status: 400 });
    }

    const education = await prisma.education.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate && { startDate: new Date(startDate) }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error("Error updating education:", error);
    return NextResponse.json({ error: "Failed to update education" }, { status: 500 });
  }
}

// DELETE education
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Education ID required" }, { status: 400 });
    }

    await prisma.education.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting education:", error);
    return NextResponse.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
