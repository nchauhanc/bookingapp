import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createBookingSchema } from "@/lib/validations";

// POST /api/bookings — create a booking (Customer only)
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createBookingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { slotId, notes } = parsed.data;

  const slot = await prisma.slot.findUnique({ where: { id: slotId } });
  if (!slot) {
    return NextResponse.json({ error: "Slot not found" }, { status: 404 });
  }
  if (slot.isBooked) {
    return NextResponse.json(
      { error: "This slot is already booked" },
      { status: 409 }
    );
  }

  // Atomic transaction: create booking + mark slot as booked
  const booking = await prisma.$transaction(async (tx) => {
    const newBooking = await tx.booking.create({
      data: {
        slotId,
        customerId: session.user.id,
        notes,
        status: "CONFIRMED",
      },
      include: {
        slot: {
          include: { professional: true },
        },
        customer: true,
      },
    });

    await tx.slot.update({
      where: { id: slotId },
      data: { isBooked: true },
    });

    return newBooking;
  });

  return NextResponse.json(booking, { status: 201 });
}

// GET /api/bookings — list bookings for the authenticated user
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const view = searchParams.get("view");

  // Professional sees bookings on their slots
  if (session.user.role === "PROFESSIONAL" || view === "professional") {
    if (session.user.role !== "PROFESSIONAL") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const bookings = await prisma.booking.findMany({
      where: {
        slot: { professionalId: session.user.id },
        status: "CONFIRMED",
      },
      include: {
        slot: true,
        customer: {
          select: { id: true, name: true, email: true, image: true, role: true, bio: true, speciality: true },
        },
      },
      orderBy: { slot: { startTime: "asc" } },
    });
    return NextResponse.json(bookings);
  }

  // Customer sees their own bookings
  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: {
      slot: {
        include: {
          professional: {
            select: { id: true, name: true, email: true, image: true, role: true, bio: true, speciality: true },
          },
        },
      },
    },
    orderBy: { slot: { startTime: "asc" } },
  });

  return NextResponse.json(bookings);
}
