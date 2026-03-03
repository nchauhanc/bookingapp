import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { addDays, addWeeks, setHours, setMinutes, setSeconds, setMilliseconds, startOfDay } from "date-fns";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRecurringSchema } from "@/lib/validations";

// POST /api/slots/recurring
// Generates individual slots from a weekly schedule template (PROFESSIONAL only).
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "PROFESSIONAL") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = createRecurringSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { days, startTime, endTime, durationMinutes, weeksAhead } = parsed.data;

  // Parse HH:MM into hours and minutes
  const [startHour, startMin] = startTime.split(":").map(Number);
  const [endHour, endMin]   = endTime.split(":").map(Number);
  const startTotalMins = startHour * 60 + startMin;
  const endTotalMins   = endHour   * 60 + endMin;

  const today     = startOfDay(new Date());
  const rangeEnd  = addWeeks(today, weeksAhead);

  // ── Generate candidate slots ──────────────────────────────────────────────
  type Candidate = { startTime: Date; endTime: Date };
  const candidates: Candidate[] = [];

  for (let week = 0; week < weeksAhead; week++) {
    for (const dayOfWeek of days) {
      // Find the date of `dayOfWeek` within this week offset from today
      const weekBase = addWeeks(today, week);          // Monday of this iteration
      const daysFromBase = (dayOfWeek - weekBase.getDay() + 7) % 7;
      const dayDate = startOfDay(addDays(weekBase, daysFromBase));

      // Skip days in the past
      if (dayDate < today) continue;
      // Skip days beyond the range
      if (dayDate >= rangeEnd) continue;

      // Generate slots within the time window
      let slotStart = startTotalMins;
      while (slotStart + durationMinutes <= endTotalMins) {
        const slotStartHour = Math.floor(slotStart / 60);
        const slotStartMin  = slotStart % 60;
        const slotEndHour   = Math.floor((slotStart + durationMinutes) / 60);
        const slotEndMin    = (slotStart + durationMinutes) % 60;

        const start = setMilliseconds(setSeconds(setMinutes(setHours(dayDate, slotStartHour), slotStartMin), 0), 0);
        const end   = setMilliseconds(setSeconds(setMinutes(setHours(dayDate, slotEndHour),   slotEndMin),   0), 0);

        candidates.push({ startTime: start, endTime: end });
        slotStart += durationMinutes;
      }
    }
  }

  if (candidates.length === 0) {
    return NextResponse.json({ created: 0, skipped: 0 });
  }

  // ── Batch overlap check — single DB query ─────────────────────────────────
  const rangeStart = candidates[0].startTime;
  const existingSlots = await prisma.slot.findMany({
    where: {
      professionalId: session.user.id,
      startTime: { lt: rangeEnd },
      endTime:   { gt: rangeStart },
    },
    select: { startTime: true, endTime: true },
  });

  // Filter out any candidate that overlaps an existing slot
  const toCreate = candidates.filter((c) =>
    !existingSlots.some(
      (e) => e.startTime < c.endTime && e.endTime > c.startTime
    )
  );

  const skipped = candidates.length - toCreate.length;

  // ── Batch insert ──────────────────────────────────────────────────────────
  if (toCreate.length > 0) {
    await prisma.slot.createMany({
      data: toCreate.map((s) => ({
        professionalId: session.user.id,
        startTime: s.startTime,
        endTime:   s.endTime,
        isBooked:  false,
      })),
      skipDuplicates: true,
    });
  }

  return NextResponse.json({ created: toCreate.length, skipped });
}
