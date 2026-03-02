import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/email";

const COOLDOWN_MS = 5 * 60 * 1000;   // 5 minutes
const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// ─── GET /api/auth/verify-email?token=xxx ─────────────────────────────────────
// Called when the user clicks the link in their verification email.
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");

  if (!token) {
    redirect("/verify-email?error=invalid");
  }

  const record = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!record) {
    redirect("/verify-email?error=invalid");
  }

  if (record.expires < new Date()) {
    await prisma.verificationToken.delete({ where: { token } }).catch(() => null);
    redirect("/verify-email?error=expired");
  }

  // Mark user as verified
  await prisma.user.update({
    where: { email: record.identifier },
    data: { emailVerified: new Date() },
  });

  // Consume the token (one-time use)
  await prisma.verificationToken.delete({ where: { token } });

  redirect("/login?verified=true");
}

// ─── POST /api/auth/verify-email  { email }  ─────────────────────────────────
// Resend a verification email (with cooldown protection).
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Return 200 to avoid email enumeration
      return NextResponse.json({ message: "If that email exists, a verification link has been sent." });
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "This email address is already verified." },
        { status: 400 }
      );
    }

    // Cooldown check
    const existing = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });

    if (existing) {
      const sentAt = new Date(existing.expires.getTime() - TOKEN_TTL_MS);
      const cooldownUntil = new Date(sentAt.getTime() + COOLDOWN_MS);
      if (new Date() < cooldownUntil) {
        const secsLeft = Math.ceil((cooldownUntil.getTime() - Date.now()) / 1000);
        return NextResponse.json(
          { error: `Please wait ${Math.ceil(secsLeft / 60)} minute(s) before requesting another email.` },
          { status: 429, headers: { "Retry-After": String(secsLeft) } }
        );
      }
      // Cooldown passed — delete old token
      await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    }

    // Create new token and send email
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires: new Date(Date.now() + TOKEN_TTL_MS),
      },
    });

    await sendVerificationEmail(email, token).catch(console.error);

    return NextResponse.json({ message: "Verification email sent. Please check your inbox." });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
