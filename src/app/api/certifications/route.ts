import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - List all certifications
export async function GET() {
  try {
    const certifications = await prisma.certification.findMany({
      orderBy: [{ order: "asc" }, { issueDate: "desc" }],
    });
    return NextResponse.json(certifications);
  } catch (error) {
    console.error("Error fetching certifications:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create new certification
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const certification = await prisma.certification.create({
      data: {
        name: data.name,
        issuer: data.issuer,
        issueDate: new Date(data.issueDate),
        expireDate: data.expireDate ? new Date(data.expireDate) : null,
        credentialId: data.credentialId || null,
        url: data.url || null,
        order: data.order || 0,
      },
    });
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error creating certification:", error);
    return NextResponse.json({ error: "Failed to create certification" }, { status: 500 });
  }
}

// PUT - Update certification
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const certification = await prisma.certification.update({
      where: { id: data.id },
      data: {
        name: data.name,
        issuer: data.issuer,
        issueDate: new Date(data.issueDate),
        expireDate: data.expireDate ? new Date(data.expireDate) : null,
        credentialId: data.credentialId || null,
        url: data.url || null,
        order: data.order || 0,
      },
    });
    return NextResponse.json(certification);
  } catch (error) {
    console.error("Error updating certification:", error);
    return NextResponse.json({ error: "Failed to update certification" }, { status: 500 });
  }
}

// DELETE - Delete certification
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.certification.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting certification:", error);
    return NextResponse.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
