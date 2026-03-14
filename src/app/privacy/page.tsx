import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Privacy Policy — BookVra",
  description: "BookVra privacy policy — what data we collect, how we use it, and your rights.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">BookVra</Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Sign in
            </Link>
            <Link href="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Content */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-xs text-gray-400 mb-2">Last updated: March 2026</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Privacy Policy</h1>

          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. What we collect</h2>
              <p>
                When you create an account with BookVra, we collect:
              </p>
              <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                <li>Your name and email address</li>
                <li>Your Google profile information (if you sign in with Google)</li>
                <li>Profile information you provide: bio, speciality, tagline, username</li>
                <li>Booking data: appointment times and notes</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. How we use your data</h2>
              <p>We use your data exclusively to provide the BookVra service:</p>
              <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                <li>To display your public booking page to potential clients</li>
                <li>To send booking confirmation emails to you and your clients</li>
                <li>To manage your schedule and appointment history</li>
                <li>To authenticate you when you sign in</li>
              </ul>
              <p className="mt-3">We do not sell your data. We do not share it with third parties for advertising purposes.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Third-party services</h2>
              <p>We use the following services to run BookVra:</p>
              <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                <li><strong>Resend</strong> — for sending transactional emails</li>
                <li><strong>Neon</strong> — for database hosting</li>
                <li><strong>Vercel</strong> — for application hosting</li>
                <li><strong>Google OAuth</strong> — for optional Google sign-in</li>
              </ul>
              <p className="mt-3">These providers are contractually obligated to protect your data.</p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Public information</h2>
              <p>
                If you are a professional, your name, speciality, tagline, bio, and booking availability
                are displayed publicly on your booking page. This is the core functionality of the service.
                You can edit or remove this information at any time from your profile settings.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Your rights</h2>
              <p>You have the right to:</p>
              <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                <li>Access the data we hold about you</li>
                <li>Correct inaccurate data</li>
                <li>Request deletion of your account and data</li>
              </ul>
              <p className="mt-3">
                To exercise any of these rights, email us at{" "}
                <a href="mailto:hello@bookvra.com" className="text-indigo-600 hover:underline">
                  hello@bookvra.com
                </a>.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Contact</h2>
              <p>
                Questions about this policy?{" "}
                <a href="mailto:hello@bookvra.com" className="text-indigo-600 hover:underline">
                  hello@bookvra.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
