import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { addDays, setHours, setMinutes } from "date-fns";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  const hash = (pw: string) => bcrypt.hash(pw, 12);

  // ─── Professionals ──────────────────────────────────────────────────────────

  const alice = await prisma.user.upsert({
    where: { email: "alice@bookslot.dev" },
    update: {},
    create: {
      name: "Dr. Alice Chen",
      email: "alice@bookslot.dev",
      password: await hash("password123"),
      role: "PROFESSIONAL",
      speciality: "Dentist",
      bio: "10 years of experience in general and cosmetic dentistry. Friendly and thorough.",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@bookslot.dev" },
    update: {},
    create: {
      name: "Bob Trainer",
      email: "bob@bookslot.dev",
      password: await hash("password123"),
      role: "PROFESSIONAL",
      speciality: "Personal Trainer",
      bio: "Certified PT with focus on strength and conditioning. Online & in-person sessions.",
    },
  });

  const sara = await prisma.user.upsert({
    where: { email: "sara@bookslot.dev" },
    update: {},
    create: {
      name: "Sara Wellness",
      email: "sara@bookslot.dev",
      password: await hash("password123"),
      role: "PROFESSIONAL",
      speciality: "Life Coach",
      bio: "Helping professionals navigate career transitions and achieve work-life balance.",
    },
  });

  // ─── Customer ───────────────────────────────────────────────────────────────

  await prisma.user.upsert({
    where: { email: "customer@bookslot.dev" },
    update: {},
    create: {
      name: "John Customer",
      email: "customer@bookslot.dev",
      password: await hash("password123"),
      role: "CUSTOMER",
    },
  });

  // ─── Slots for professionals (next 5 weekdays) ───────────────────────────────

  function makeSlot(professionalId: string, daysFromNow: number, startHour: number) {
    const base = addDays(new Date(), daysFromNow);
    const start = setMinutes(setHours(base, startHour), 0);
    const end = setMinutes(setHours(base, startHour + 1), 0);
    return prisma.slot.create({
      data: { professionalId, startTime: start, endTime: end },
    });
  }

  // Clear existing slots to avoid duplicates on re-seed
  await prisma.slot.deleteMany({ where: { professionalId: alice.id } });
  await prisma.slot.deleteMany({ where: { professionalId: bob.id } });
  await prisma.slot.deleteMany({ where: { professionalId: sara.id } });

  const slotOps = [];
  for (let day = 1; day <= 5; day++) {
    slotOps.push(makeSlot(alice.id, day, 9));
    slotOps.push(makeSlot(alice.id, day, 11));
    slotOps.push(makeSlot(alice.id, day, 14));
    slotOps.push(makeSlot(bob.id, day, 8));
    slotOps.push(makeSlot(bob.id, day, 10));
    slotOps.push(makeSlot(bob.id, day, 17));
    slotOps.push(makeSlot(sara.id, day, 10));
    slotOps.push(makeSlot(sara.id, day, 15));
  }

  await Promise.all(slotOps);

  console.log("✅ Seed complete. Test accounts:");
  console.log("   Professional: alice@bookslot.dev / password123");
  console.log("   Professional: bob@bookslot.dev / password123");
  console.log("   Professional: sara@bookslot.dev / password123");
  console.log("   Customer:     customer@bookslot.dev / password123");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
