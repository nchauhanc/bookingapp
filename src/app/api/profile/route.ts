import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateProfileSchema } from "@/lib/validations";

const PROFILE_SELECT = {
  id:         true,
  name:       true,
  email:      true,
  image:      true,
  username:   true,
  speciality: true,
  tagline:    true,
  bio:        true,
  role:       true,
} as const;

// GET /api/profile — fetch the current user's profile fields
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: PROFILE_SELECT,
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

// PUT /api/profile — update editable profile fields
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = updateProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0].message },
      { status: 400 }
    );
  }

  const { name, username, speciality, tagline, bio } = parsed.data;

  // Check username uniqueness (ignore own current username)
  if (username) {
    const conflict = await prisma.user.findUnique({ where: { username } });
    if (conflict && conflict.id !== session.user.id) {
      return NextResponse.json(
        { error: "That username is already taken. Please choose another." },
        { status: 409 }
      );
    }
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      username:   username   || null,
      speciality: speciality || null,
      tagline:    tagline    || null,
      bio:        bio        || null,
    },
    select: PROFILE_SELECT,
  });

  return NextResponse.json(user);
}
