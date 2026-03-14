import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Terms of Service — BookVra",
  description: "BookVra terms of service.",
};

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-10">Terms of Service</h1>

          <div className="space-y-10 text-gray-600 leading-relaxed">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">1. Acceptance</h2>
              <p>
                By creating an account or using BookVra (&ldquo;the Service&rdquo;), you agree to these Terms of Service.
                If you do not agree, please do not use the Service.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">2. Description of service</h2>
              <p>
                BookVra provides professionals with a public booking page where clients can view availability
                and schedule appointments. The Service is provided free of charge during the current phase.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">3. Your account</h2>
              <p>You are responsible for:</p>
              <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                <li>Maintaining the security of your account credentials</li>
                <li>All activity that occurs under your account</li>
                <li>Providing accurate information in your profile</li>
                <li>Honouring appointments you accept through the Service</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">4. Acceptable use</h2>
              <p>You agree not to:</p>
              <ul className="mt-3 ml-4 space-y-1.5 list-disc">
                <li>Use the Service for any unlawful purpose</li>
                <li>Impersonate another person or entity</li>
                <li>Upload malicious content or attempt to compromise the Service</li>
                <li>Create fake profiles or bookings</li>
                <li>Use the Service to spam or harass other users</li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">5. Bookings and appointments</h2>
              <p>
                BookVra facilitates scheduling between professionals and clients. We are not a party to
                any service agreement between a professional and their client. Professionals are solely
                responsible for the services they provide.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">6. Termination</h2>
              <p>
                You may delete your account at any time by contacting us. We reserve the right to
                suspend or terminate accounts that violate these terms.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">7. Changes to these terms</h2>
              <p>
                We may update these terms from time to time. We&apos;ll notify registered users by email
                before significant changes take effect.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-3">8. Contact</h2>
              <p>
                Questions?{" "}
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
