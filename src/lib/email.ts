import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  // In development (no API key configured), log the URL so you can test without emails
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "re_placeholder") {
    console.log("\n📧 [DEV] Verification email would be sent to:", email);
    console.log("🔗 Verify URL:", verifyUrl, "\n");
    return;
  }

  await resend.emails.send({
    from: "BookSlot <noreply@bookslot.dev>",
    to: email,
    subject: "Verify your BookSlot account",
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9fafb; margin: 0; padding: 40px 0;">
  <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
    <h1 style="color: #4f46e5; font-size: 24px; margin: 0 0 8px;">BookSlot</h1>
    <h2 style="color: #111827; font-size: 20px; margin: 0 0 16px;">Verify your email address</h2>
    <p style="color: #6b7280; margin: 0 0 24px; line-height: 1.6;">
      Thanks for signing up! Click the button below to verify your email address.
      This link expires in <strong>24 hours</strong>.
    </p>
    <a href="${verifyUrl}"
       style="display: inline-block; background: #4f46e5; color: white; text-decoration: none;
              padding: 12px 28px; border-radius: 8px; font-weight: 600; font-size: 15px;">
      Verify Email Address
    </a>
    <p style="color: #9ca3af; font-size: 13px; margin: 24px 0 0; line-height: 1.6;">
      Or copy and paste this link into your browser:<br>
      <a href="${verifyUrl}" style="color: #4f46e5; word-break: break-all;">${verifyUrl}</a>
    </p>
    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;">
    <p style="color: #9ca3af; font-size: 12px; margin: 0;">
      If you didn't create a BookSlot account, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
    `.trim(),
  });
}
