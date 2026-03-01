import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSlotSchema } from "@/lib/validations";

// POST /api/slots — create a new available slot (Professional only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "PROFESSIONAL") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createSlotSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { startTime, endTime } = parsed.data;
  const start = new Date(startTime);
  const end = new Date(endTime);

  // Check for overlapping slots for this professional
  const overlap = await prisma.slot.findFirst({
    where: {
      professionalId: session.user.id,
      AND: [
        { startTime: { lt: end } },
        { endTime: { gt: start } },
      ],
    },
  });

  if (overlap) {
    return NextResponse.json(
      { error: "This time overlaps with an existing slot" },
      { status: 409 }
    );
  }

  const slot = await prisma.slot.create({
    data: {
      professionalId: session.user.id,
      startTime: start,
      endTime: end,
    },
  });

  return NextResponse.json(slot, { status: 201 });
}
