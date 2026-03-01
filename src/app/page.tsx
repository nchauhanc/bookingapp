import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  // Redirect authenticated users to their dashboard
  if (session?.user?.role === "PROFESSIONAL") redirect("/professional");
  if (session?.user?.role === "CUSTOMER") redirect("/customer");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
        <span className="text-2xl font-bold text-indigo-600">BookSlot</span>
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            Get started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-6xl mx-auto px-6 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 mb-6">
          ✨ Professional scheduling, simplified
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
          Book appointments.
          <br />
          <span className="text-indigo-600">Grow your practice.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
          Professionals set their availability. Customers book in seconds.
          No back-and-forth. No missed bookings.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/register"
            className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Start for free →
          </Link>
          <Link
            href="/login"
            className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Sign in
          </Link>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          {[
            {
              icon: "📅",
              title: "Open Your Calendar",
              desc: "Professionals publish available time slots for customers to book.",
            },
            {
              icon: "⚡",
              title: "Instant Booking",
              desc: "Customers browse, pick a slot, and confirm in under a minute.",
            },
            {
              icon: "🔔",
              title: "Stay Organised",
              desc: "Both sides get a clear view of all upcoming appointments.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
