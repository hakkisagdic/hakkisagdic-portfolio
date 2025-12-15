import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET all highlights
export async function GET() {
  try {
    const highlights = await prisma.highlight.findMany({
      orderBy: { order: "asc" },
    });
    return NextResponse.json(highlights);
  } catch (error) {
    console.error("Error fetching highlights:", error);
    return NextResponse.json({ error: "Failed to fetch highlights" }, { status: 500 });
  }
}

// POST new highlight
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { icon, title, description, order } = body;

    const highlight = await prisma.highlight.create({
      data: {
        icon,
        title,
        description,
        order: order || 0,
      },
    });

    return NextResponse.json(highlight, { status: 201 });
  } catch (error) {
    console.error("Error creating highlight:", error);
    return NextResponse.json({ error: "Failed to create highlight" }, { status: 500 });
  }
}

// PUT update highlight
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: "Highlight ID required" }, { status: 400 });
    }

    const highlight = await prisma.highlight.update({
      where: { id },
      data,
    });

    return NextResponse.json(highlight);
  } catch (error) {
    console.error("Error updating highlight:", error);
    return NextResponse.json({ error: "Failed to update highlight" }, { status: 500 });
  }
}

// DELETE highlight
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Highlight ID required" }, { status: 400 });
    }

    await prisma.highlight.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting highlight:", error);
    return NextResponse.json({ error: "Failed to delete highlight" }, { status: 500 });
  }
}
