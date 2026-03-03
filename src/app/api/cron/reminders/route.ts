import { NextRequest, NextResponse } from "next/server";
import { addHours } from "date-fns";
import { prisma } from "@/lib/prisma";
import { sendReminderToCustomer, sendReminderToProfessional, type BookingEmailData } from "@/lib/email";

/**
 * GET /api/cron/reminders
 *
 * Called hourly by Vercel Cron (see vercel.json).
 * Sends 24-hour reminder emails to both parties for upcoming confirmed bookings.
 *
 * Window: bookings whose startTime falls in [now+23h, now+25h].
 * Running hourly means every booking is caught by exactly one cron run,
 * so reminders are never duplicated — no extra DB column required.
 *
 * Protected by CRON_SECRET environment variable.
 */
export async function GET(req: NextRequest) {
  // Verify the request comes from Vercel Cron (or our own test calls)
  const authHeader = req.headers.get("authorization");
  const secret = process.env.CRON_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const windowStart = addHours(now, 23);
  const windowEnd   = addHours(now, 25);

  const bookings = await prisma.booking.findMany({
    where: {
      status: "CONFIRMED",
      slot: {
        startTime: { gte: windowStart, lte: windowEnd },
      },
    },
    include: {
      slot: { include: { professional: true } },
      customer: true,
    },
  });

  if (bookings.length === 0) {
    return NextResponse.json({ sent: 0 });
  }

  const results = await Promise.allSettled(
    bookings.flatMap((b) => {
      const emailData: BookingEmailData = {
        customerName:      b.customer.name ?? "Customer",
        customerEmail:     b.customer.email!,
        professionalName:  b.slot.professional.name ?? "Professional",
        professionalEmail: b.slot.professional.email!,
        speciality:        b.slot.professional.speciality,
        startTime:         b.slot.startTime,
        endTime:           b.slot.endTime,
        notes:             b.notes,
      };
      return [
        sendReminderToCustomer(emailData),
        sendReminderToProfessional(emailData),
      ];
    })
  );

  const failed = results.filter((r) => r.status === "rejected").length;
  const sent   = results.length - failed;

  console.log(`[cron/reminders] ${bookings.length} bookings · ${sent} emails sent · ${failed} failed`);

  return NextResponse.json({ bookings: bookings.length, sent, failed });
}
