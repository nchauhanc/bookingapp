import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "About — BookVra",
  description: "BookVra is a scheduling tool for solo professionals. Learn more about what we're building.",
};

export default function AboutPage() {
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

      {/* Content */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About BookVra</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <p>
              BookVra is a scheduling tool built for solo professionals — coaches, tutors, trainers, therapists,
              consultants, and anyone else who earns a living through one-on-one sessions.
            </p>

            <p>
              The problem we&apos;re solving is simple: managing bookings over WhatsApp, email, or DMs is painful.
              You spend more time coordinating than working. BookVra gives you a public booking page where
              clients can see your real availability and book in seconds — no back-and-forth required.
            </p>

            <p>
              We built BookVra as a focused, no-nonsense tool. You set your schedule, share your link, and
              we handle the rest — confirmation emails, calendar management, and keeping track of who&apos;s coming.
            </p>

            <p>
              BookVra is currently free and early-stage. We&apos;re building in public and talking to real
              professionals to make sure we solve the right problems.
            </p>

            <p>
              Have feedback, questions, or want to work with us?{" "}
              <a href="mailto:hello@bookvra.com" className="text-indigo-600 hover:underline">
                hello@bookvra.com
              </a>
            </p>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Create your free page →
            </Link>
            <Link
              href="/browse"
              className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Browse professionals
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
