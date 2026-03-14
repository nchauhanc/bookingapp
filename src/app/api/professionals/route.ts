import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { scoreProfessional } from "@/lib/scoring";

// GET /api/professionals — list listed professionals, sorted by relevance (Customer only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";
  const customerCity = searchParams.get("city") ?? "";
  const customerCountry = searchParams.get("country") ?? "";

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const professionals = await prisma.user.findMany({
    where: {
      role: "PROFESSIONAL",
      isListed: true,
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { speciality: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      bio: true,
      speciality: true,
      city: true,
      country: true,
      _count: {
        select: {
          slots: {
            where: { isBooked: false, startTime: { gte: new Date() } },
          },
          bookings: {
            where: { createdAt: { gte: thirtyDaysAgo }, status: "CONFIRMED" },
          },
        },
      },
    },
  });

  // Sort by relevance score descending
  const scored = professionals
    .map((pro) => ({
      ...pro,
      _score: scoreProfessional(
        {
          bio: pro.bio,
          speciality: pro.speciality,
          city: pro.city,
          country: pro.country,
          name: pro.name,
          _count: {
            slots: pro._count.slots,
            recentBookings: pro._count.bookings,
          },
        },
        search,
        customerCity,
        customerCountry
      ),
    }))
    .sort((a, b) => b._score - a._score)
    .map(({ _score, _count, ...rest }) => rest);

  return NextResponse.json(scored);
}
