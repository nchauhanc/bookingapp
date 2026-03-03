import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  sendBookingCancellationToCustomer,
  sendBookingCancellationToProfessional,
  type BookingEmailData,
} from "@/lib/email";

// DELETE /api/bookings/:id — cancel a booking (Customer only)
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "CUSTOMER") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      slot: { include: { professional: true } },
      customer: true,
    },
  });

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  if (booking.customerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (booking.status === "CANCELLED") {
    return NextResponse.json({ error: "Already cancelled" }, { status: 409 });
  }

  // Atomic transaction: cancel booking + free the slot
  await prisma.$transaction([
    prisma.booking.update({
      where: { id },
      data: { status: "CANCELLED" },
    }),
    prisma.slot.update({
      where: { id: booking.slotId },
      data: { isBooked: false },
    }),
  ]);

  // Fire cancellation emails to both parties (non-blocking)
  const emailData: BookingEmailData = {
    customerName:      booking.customer.name ?? "Customer",
    customerEmail:     booking.customer.email!,
    professionalName:  booking.slot.professional.name ?? "Professional",
    professionalEmail: booking.slot.professional.email!,
    speciality:        booking.slot.professional.speciality,
    startTime:         booking.slot.startTime,
    endTime:           booking.slot.endTime,
    notes:             booking.notes,
  };

  Promise.all([
    sendBookingCancellationToCustomer(emailData),
    sendBookingCancellationToProfessional(emailData),
  ]).catch(console.error);

  return NextResponse.json({ success: true });
}
