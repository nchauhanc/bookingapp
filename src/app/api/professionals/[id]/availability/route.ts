import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/professionals/:id/availability — list available slots for a professional
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const showAll = searchParams.get("showAll") === "true"; // for professional's own view

  // Only the professional themselves or customers can access
  const isOwner = session.user.id === id && session.user.role === "PROFESSIONAL";
  const isCustomer = session.user.role === "CUSTOMER";

  if (!isOwner && !isCustomer) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const slots = await prisma.slot.findMany({
    where: {
      professionalId: id,
      // Customers only see available (non-booked) future slots
      // Professionals see all their slots
      ...(!isOwner && !showAll ? { isBooked: false } : {}),
      ...(from ? { startTime: { gte: new Date(from) } } : {}),
      ...(to ? { endTime: { lte: new Date(to) } } : {}),
      // By default only show future slots
      ...(!from ? { startTime: { gte: new Date() } } : {}),
    },
    orderBy: { startTime: "asc" },
    include: isOwner
      ? {
          booking: {
            include: {
              customer: {
                select: { id: true, name: true, email: true, image: true, role: true, bio: true, speciality: true },
              },
            },
          },
        }
      : undefined,
  });

  return NextResponse.json(slots);
}
