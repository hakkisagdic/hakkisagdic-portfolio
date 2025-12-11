import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET - List all messages
export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json([], { status: 200 });
  }
}

// POST - Create new message (from contact form)
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const message = await prisma.contactMessage.create({
      data: {
        name: data.name,
        email: data.email,
        subject: data.subject || null,
        message: data.message,
        read: false,
        replied: false,
      },
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

// PUT - Update message (mark as read/replied)
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const updateData: { read?: boolean; replied?: boolean } = {};
    
    if (typeof data.read === "boolean") {
      updateData.read = data.read;
    }
    if (typeof data.replied === "boolean") {
      updateData.replied = data.replied;
    }

    const message = await prisma.contactMessage.update({
      where: { id: data.id },
      data: updateData,
    });
    return NextResponse.json(message);
  } catch (error) {
    console.error("Error updating message:", error);
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 });
  }
}

// DELETE - Delete message
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    
    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
