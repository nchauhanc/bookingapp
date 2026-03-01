import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/professionals — list all professionals (Customer only)
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") ?? "";

  const professionals = await prisma.user.findMany({
    where: {
      role: "PROFESSIONAL",
      ...(search
        ? {
            OR: [
              { name: { contains: search } },
              { speciality: { contains: search } },
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
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(professionals);
}
