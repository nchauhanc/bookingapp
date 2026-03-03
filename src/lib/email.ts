import { Resend } from "resend";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "BookSlot <onboarding@resend.dev>";

const isDev =
  !process.env.RESEND_API_KEY ||
  process.env.RESEND_API_KEY === "re_placeholder";

// ─── Shared send helper ────────────────────────────────────────────────────────
async function send(to: string, subject: string, html: string): Promise<void> {
  if (isDev) {
    console.log(`\n📧 [DEV] Email → ${to}\n   Subject: ${subject}\n`);
    return;
  }
  await resend.emails.send({ from: FROM, to, subject, html });
}

// ─── Shared HTML wrapper ──────────────────────────────────────────────────────
function emailWrapper(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f9fafb;margin:0;padding:40px 0;">
  <div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;padding:40px;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
    <p style="color:#4f46e5;font-size:20px;font-weight:700;margin:0 0 24px;">BookSlot</p>
    ${body}
    <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0;">
    <p style="color:#9ca3af;font-size:12px;margin:0;">You're receiving this because you use BookSlot.</p>
  </div>
</body>
</html>`.trim();
}

// ─── Slot time formatter ──────────────────────────────────────────────────────
function fmtSlot(start: Date, end: Date): string {
  return `${format(start, "EEEE, MMMM d, yyyy")} · ${format(start, "h:mm a")} – ${format(end, "h:mm a")}`;
}

// ─── Booking detail block (shared across templates) ───────────────────────────
function bookingBlock(fields: { label: string; value: string }[]): string {
  return `
  <table style="width:100%;border-collapse:collapse;margin:16px 0;">
    ${fields
      .map(
        (f) => `
    <tr>
      <td style="padding:8px 0;color:#6b7280;font-size:13px;width:40%;vertical-align:top;">${f.label}</td>
      <td style="padding:8px 0;color:#111827;font-size:13px;font-weight:500;">${f.value}</td>
    </tr>`
      )
      .join("")}
  </table>`;
}

// ─── Types used across email functions ────────────────────────────────────────
export interface BookingEmailData {
  customerName:      string;
  customerEmail:     string;
  professionalName:  string;
  professionalEmail: string;
  speciality:        string | null;
  startTime:         Date;
  endTime:           Date;
  notes?:            string | null;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. VERIFICATION EMAIL
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<void> {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`;

  if (isDev) {
    console.log("\n📧 [DEV] Verification email would be sent to:", email);
    console.log("🔗 Verify URL:", verifyUrl, "\n");
    return;
  }

  await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Verify your BookSlot account",
    html: emailWrapper(`
      <h2 style="color:#111827;font-size:20px;margin:0 0 12px;">Verify your email address</h2>
      <p style="color:#6b7280;margin:0 0 24px;line-height:1.6;">
        Thanks for signing up! Click the button below to verify your email address.
        This link expires in <strong>24 hours</strong>.
      </p>
      <a href="${verifyUrl}"
         style="display:inline-block;background:#4f46e5;color:white;text-decoration:none;
                padding:12px 28px;border-radius:8px;font-weight:600;font-size:15px;">
        Verify Email Address
      </a>
      <p style="color:#9ca3af;font-size:13px;margin:24px 0 0;line-height:1.6;">
        Or copy this link:<br>
        <a href="${verifyUrl}" style="color:#4f46e5;word-break:break-all;">${verifyUrl}</a>
      </p>
    `),
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. BOOKING CONFIRMATION
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendBookingConfirmationToCustomer(
  d: BookingEmailData
): Promise<void> {
  const subject = `Booking confirmed — ${format(d.startTime, "EEE, MMM d")} with ${d.professionalName}`;
  const html = emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">You're booked! ✅</h2>
    <p style="color:#6b7280;margin:0 0 16px;">
      Your appointment with <strong>${d.professionalName}</strong>${d.speciality ? ` (${d.speciality})` : ""} is confirmed.
    </p>
    ${bookingBlock([
      { label: "Date & time", value: fmtSlot(d.startTime, d.endTime) },
      { label: "Professional", value: d.professionalName },
      ...(d.notes ? [{ label: "Your notes", value: d.notes }] : []),
    ])}
    <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">
      If you need to cancel, sign in to BookSlot and manage your bookings from your dashboard.
    </p>
  `);
  await send(d.customerEmail, subject, html);
}

export async function sendBookingConfirmationToProfessional(
  d: BookingEmailData
): Promise<void> {
  const subject = `New booking from ${d.customerName} — ${format(d.startTime, "EEE, MMM d")}`;
  const html = emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">New booking 📆</h2>
    <p style="color:#6b7280;margin:0 0 16px;">
      <strong>${d.customerName}</strong> has booked a session with you.
    </p>
    ${bookingBlock([
      { label: "Date & time",  value: fmtSlot(d.startTime, d.endTime) },
      { label: "Customer",     value: `${d.customerName} (${d.customerEmail})` },
      ...(d.notes ? [{ label: "Customer notes", value: d.notes }] : []),
    ])}
    <p style="color:#6b7280;font-size:13px;margin:16px 0 0;">
      View all your upcoming bookings in your BookSlot dashboard.
    </p>
  `);
  await send(d.professionalEmail, subject, html);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. BOOKING CANCELLATION
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendBookingCancellationToCustomer(
  d: BookingEmailData
): Promise<void> {
  const subject = `Booking cancelled — ${format(d.startTime, "EEE, MMM d")} with ${d.professionalName}`;
  const html = emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Booking cancelled</h2>
    <p style="color:#6b7280;margin:0 0 16px;">
      Your booking with <strong>${d.professionalName}</strong> has been cancelled.
      The slot is now available to rebook.
    </p>
    ${bookingBlock([
      { label: "Date & time",  value: fmtSlot(d.startTime, d.endTime) },
      { label: "Professional", value: d.professionalName },
    ])}
  `);
  await send(d.customerEmail, subject, html);
}

export async function sendBookingCancellationToProfessional(
  d: BookingEmailData
): Promise<void> {
  const subject = `Booking cancelled by ${d.customerName} — ${format(d.startTime, "EEE, MMM d")}`;
  const html = emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Booking cancelled</h2>
    <p style="color:#6b7280;margin:0 0 16px;">
      <strong>${d.customerName}</strong> has cancelled their booking. The slot is now free.
    </p>
    ${bookingBlock([
      { label: "Date & time", value: fmtSlot(d.startTime, d.endTime) },
      { label: "Customer",    value: `${d.customerName} (${d.customerEmail})` },
    ])}
  `);
  await send(d.professionalEmail, subject, html);
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. 24-HOUR REMINDER
// ═══════════════════════════════════════════════════════════════════════════════

export async function sendReminderToCustomer(d: BookingEmailData): Promise<void> {
  const subject = `Reminder: session with ${d.professionalName} is tomorrow`;
  const html = emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Session reminder ⏰</h2>
    <p style="color:#6b7280;margin:0 0 16px;">
      Just a reminder — you have a session with <strong>${d.professionalName}</strong> tomorrow.
    </p>
    ${bookingBlock([
      { label: "Date & time",  value: fmtSlot(d.startTime, d.endTime) },
      { label: "Professional", value: `${d.professionalName}${d.speciality ? ` · ${d.speciality}` : ""}` },
      ...(d.notes ? [{ label: "Your notes", value: d.notes }] : []),
    ])}
  `);
  await send(d.customerEmail, subject, html);
}

export async function sendReminderToProfessional(d: BookingEmailData): Promise<void> {
  const subject = `Reminder: session with ${d.customerName} is tomorrow`;
  const html = emailWrapper(`
    <h2 style="color:#111827;font-size:20px;margin:0 0 8px;">Session reminder ⏰</h2>
    <p style="color:#6b7280;margin:0 0 16px;">
      Just a reminder — you have a session with <strong>${d.customerName}</strong> tomorrow.
    </p>
    ${bookingBlock([
      { label: "Date & time", value: fmtSlot(d.startTime, d.endTime) },
      { label: "Customer",    value: `${d.customerName} (${d.customerEmail})` },
    ])}
  `);
  await send(d.professionalEmail, subject, html);
}
