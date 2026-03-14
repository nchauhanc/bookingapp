import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "PROFESSIONAL") redirect("/professional");
  if (session?.user?.role === "CUSTOMER") redirect("/customer");

  return (
    <div className="min-h-screen bg-white">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <span className="text-2xl font-bold text-indigo-600">BookVra</span>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="hidden sm:block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Pricing
            </Link>
            <Link href="/browse" className="hidden sm:block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Browse
            </Link>
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
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
            <Link href="/register" className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors">
              Start for free →
            </Link>
            <Link href="/browse" className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Browse professionals
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mock UI Preview ── */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">See it in action</h2>
            <p className="mt-3 text-gray-500">A professional&apos;s public page — live availability, instant booking.</p>
          </div>

          {/* Mock booking page */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
            {/* Mock nav bar */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <span className="text-sm font-bold text-indigo-600">BookVra</span>
              <div className="flex gap-2">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-500">Sign in</span>
                <span className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs text-white">Sign up</span>
              </div>
            </div>

            <div className="p-5">
              {/* Mock professional card */}
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 mb-5">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl shrink-0">🧑‍💼</div>
                <div>
                  <p className="font-semibold text-gray-900">Alex Johnson</p>
                  <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">Personal Trainer</span>
                  <p className="mt-1 text-xs text-gray-500 italic">&ldquo;Helping you move better, one session at a time&rdquo;</p>
                </div>
              </div>

              {/* Mock calendar */}
              <p className="text-sm font-semibold text-gray-700 mb-3">Available Slots</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {[
                  { day: "Mon 17", slots: ["09:00", "11:00"] },
                  { day: "Tue 18", slots: ["10:00", "14:00", "16:00"] },
                  { day: "Wed 19", slots: ["09:00"] },
                  { day: "Thu 20", slots: ["11:00", "15:00"] },
                ].map((col) => (
                  <div key={col.day} className="flex flex-col gap-1.5">
                    <p className="text-center text-xs font-medium text-gray-500 mb-1">{col.day}</p>
                    {col.slots.map((t) => (
                      <div key={t} className="cursor-pointer rounded-lg bg-emerald-50 px-2 py-2 text-center text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors">
                        {t}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white opacity-50 cursor-default">
                Select a slot to book
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">How it works</h2>
            <p className="mt-3 text-gray-500">Simple for professionals. Even simpler for customers.</p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {/* Professional side */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-6">For Professionals</p>
              <div className="flex flex-col gap-6">
                {[
                  { n: "1", title: "Set your schedule", desc: "Use the weekly template to publish your availability in one click — Mon to Fri, any time window, any session length." },
                  { n: "2", title: "Share your link", desc: "You get a personal booking page at bookvra.com/p/your-name. Send it to clients, add it to your bio, post it anywhere." },
                  { n: "3", title: "Manage bookings", desc: "See who's coming, get email confirmations, and cancel with one click when you need to." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                      {s.n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{s.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/register?role=PROFESSIONAL" className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors">
                  Set up your page →
                </Link>
              </div>
            </div>

            {/* Customer side */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-6">For Customers</p>
              <div className="flex flex-col gap-6">
                {[
                  { n: "1", title: "Find a professional", desc: "Browse our directory by category — coaches, tutors, trainers, therapists and more." },
                  { n: "2", title: "Pick a slot", desc: "See real-time availability on the professional's page. No emails, no waiting." },
                  { n: "3", title: "Book in seconds", desc: "Confirm your booking and get an instant email confirmation with all the details." },
                ].map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <div className="shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600">
                      {s.n}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{s.title}</p>
                      <p className="mt-0.5 text-sm text-gray-500 leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link href="/browse" className="inline-flex rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
                  Browse professionals →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Built for solo professionals</h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            Anyone who offers sessions, lessons, or appointments — and is tired of managing bookings over WhatsApp.
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {[
              { icon: "🎾", label: "Coach" },
              { icon: "📚", label: "Tutor" },
              { icon: "💪", label: "Trainer" },
              { icon: "💆", label: "Therapist" },
              { icon: "🔧", label: "Consultant" },
              { icon: "🎨", label: "Creative" },
            ].map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                <span className="text-3xl">{p.icon}</span>
                <p className="text-sm font-medium text-gray-700">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social proof bar ── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            {[
              { stat: "Free", label: "No credit card required" },
              { stat: "< 5 min", label: "To set up your page" },
              { stat: "Instant", label: "Booking confirmations" },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-3xl font-bold text-indigo-600">{item.stat}</p>
                <p className="mt-1 text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bg-indigo-600 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to stop managing bookings manually?
          </h2>
          <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
            Set up your public booking page in under 5 minutes. Free, forever.
          </p>
          <Link href="/register" className="inline-flex rounded-xl bg-white px-8 py-4 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
            Create your free account →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
