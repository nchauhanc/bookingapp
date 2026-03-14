import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Pricing — BookVra",
  description: "BookVra is free. Set up your booking page in minutes, no credit card required.",
};

const features = [
  "Unlimited slots",
  "Unlimited bookings",
  "Public booking page",
  "Custom link (bookvra.com/p/your-name)",
  "Instant confirmation emails",
  "Weekly schedule templates",
  "Mobile-friendly for you and your clients",
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">BookVra</Link>
          <div className="flex items-center gap-2">
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

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, honest pricing</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            BookVra is free to use. No subscriptions, no hidden fees, no credit card required.
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-6">
          <div className="rounded-2xl bg-white ring-2 ring-indigo-600 shadow-xl overflow-hidden">
            {/* Card header */}
            <div className="bg-indigo-600 px-8 py-6 text-center">
              <p className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-1">Free</p>
              <p className="text-5xl font-bold text-white">£0</p>
              <p className="mt-1 text-indigo-200 text-sm">per month, forever</p>
            </div>

            {/* Features */}
            <div className="px-8 py-8">
              <ul className="flex flex-col gap-3">
                {features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <span className="mt-0.5 text-emerald-500 shrink-0">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link
                  href="/register"
                  className="block rounded-xl bg-indigo-600 px-6 py-4 text-center text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Get started free →
                </Link>
              </div>
            </div>
          </div>

          {/* Paid plans note */}
          <p className="mt-6 text-center text-sm text-gray-500">
            Paid plans may be introduced in the future — we&apos;ll notify you well in advance before anything changes.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-t border-gray-100 py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Questions</h2>
          <div className="flex flex-col gap-6">
            {[
              {
                q: "Is it really free?",
                a: "Yes. BookVra is completely free right now. We're focused on building something useful for solo professionals.",
              },
              {
                q: "Do I need a credit card?",
                a: "No. Sign up with your email or Google account — no payment information required.",
              },
              {
                q: "What happens if you introduce paid plans?",
                a: "We'll notify all existing users well before any changes. Early adopters will always be treated well.",
              },
              {
                q: "Is there a limit on bookings or slots?",
                a: "No limits. Create as many slots as you need and accept as many bookings as you like.",
              },
            ].map((item) => (
              <div key={item.q} className="rounded-xl bg-white p-6 ring-1 ring-gray-200">
                <p className="font-semibold text-gray-900 mb-2">{item.q}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
