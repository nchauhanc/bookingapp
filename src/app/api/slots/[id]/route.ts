import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// DELETE /api/slots/:id — remove a slot (Professional only, cannot delete booked slots)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "PROFESSIONAL") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slot = await prisma.slot.findUnique({ where: { id } });
  if (!slot) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }
  if (slot.professionalId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (slot.isBooked) {
    return NextResponse.json(
      { error: "Cannot delete a booked slot" },
      { status: 409 }
    );
  }

  await prisma.slot.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
