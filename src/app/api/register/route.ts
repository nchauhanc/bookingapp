import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/hash";
import { registerSchema, toSlug } from "@/lib/validations";
import { sendVerificationEmail } from "@/lib/email";

const COOLDOWN_MS = 5 * 60 * 1000;  // 5 minutes
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, role } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      // If already verified, tell them to log in
      if (existing.emailVerified) {
        return NextResponse.json(
          { error: "Email already registered. Please sign in." },
          { status: 409 }
        );
      }

      // Already registered but not verified — check cooldown before resending
      const pendingToken = await prisma.verificationToken.findFirst({
        where: { identifier: email },
      });
      if (pendingToken) {
        const sentAt = new Date(pendingToken.expires.getTime() - TOKEN_TTL_MS);
        const cooldownUntil = new Date(sentAt.getTime() + COOLDOWN_MS);
        if (new Date() < cooldownUntil) {
          const secsLeft = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
          return NextResponse.json(
            {
              error: `A verification email was already sent. Please check your inbox or wait ${Math.ceil(secsLeft / 60)} minute(s) before trying again.`,
            },
            { status: 429, headers: { "Retry-After": String(secsLeft) } }
          );
        }
      }

      // Cooldown passed — resend a fresh token
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });
      const token = crypto.randomBytes(32).toString("hex");
      await prisma.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + TOKEN_TTL_MS),
        },
      });
      await sendVerificationEmail(email, token).catch(console.error);
      return NextResponse.json(
        { message: "Verification email resent. Please check your inbox." },
        { status: 200 }
      );
    }

    // New user — generate a unique username slug from their name
    const hashedPassword = await hashPassword(password);
    const baseSlug = toSlug(name) || "user";
    let username = baseSlug;
    let suffix = 1;
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseSlug}-${suffix++}`;
    }
    await prisma.user.create({
      data: { name, email, password: hashedPassword, role, username },
    });

    // Generate and store verification token
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    // Send verification email (non-blocking — don't fail registration if email fails)
    await sendVerificationEmail(email, token).catch(console.error);

    return NextResponse.json(
      { message: "Registration successful. Please check your email to verify your account." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
