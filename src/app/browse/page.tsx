import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Browse Professionals — BookVra",
  description: "Find coaches, tutors, trainers, therapists and more. Book your appointment in seconds.",
};

export default async function BrowsePage() {
  const professionals = await prisma.user.findMany({
    where: { role: "PROFESSIONAL" },
    select: {
      id: true,
      name: true,
      username: true,
      speciality: true,
      tagline: true,
      bio: true,
      image: true,
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">BookVra</Link>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="hidden sm:block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              Pricing
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

      {/* Header */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find a professional</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Browse coaches, tutors, trainers, therapists and more. No account needed to browse.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-6">
          {professionals.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-4xl mb-4">🔍</p>
              <p className="text-lg font-medium text-gray-600">No professionals listed yet.</p>
              <p className="mt-2 text-sm">Be the first — <Link href="/register?role=PROFESSIONAL" className="text-indigo-600 hover:underline">create your profile</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {professionals.map((pro) => {
                const handle = pro.username ?? pro.id;
                const initials = (pro.name ?? "?")
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase();

                return (
                  <Link
                    key={pro.id}
                    href={`/p/${handle}`}
                    className="group flex flex-col rounded-2xl bg-white ring-1 ring-gray-200 shadow-sm hover:shadow-md hover:ring-indigo-200 transition-all overflow-hidden"
                  >
                    {/* Card header */}
                    <div className="flex items-center gap-4 p-5">
                      {pro.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={pro.image}
                          alt={pro.name ?? "Professional"}
                          className="h-14 w-14 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-lg font-bold text-indigo-600 shrink-0">
                          {initials}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                          {pro.name ?? "Professional"}
                        </p>
                        {pro.speciality && (
                          <span className="inline-block mt-0.5 rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                            {pro.speciality}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tagline / bio */}
                    {(pro.tagline || pro.bio) && (
                      <div className="px-5 pb-5 border-t border-gray-50 pt-3">
                        {pro.tagline && (
                          <p className="text-xs text-gray-500 italic mb-1">&ldquo;{pro.tagline}&rdquo;</p>
                        )}
                        {pro.bio && (
                          <p className="text-sm text-gray-600 line-clamp-2">{pro.bio}</p>
                        )}
                      </div>
                    )}

                    {/* CTA footer */}
                    <div className="mt-auto px-5 pb-4 pt-2">
                      <span className="text-xs font-semibold text-indigo-600 group-hover:underline">
                        View & book →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gray-50 border-t border-gray-100 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Are you a professional?</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Set up your free booking page in under 5 minutes and start accepting appointments.
          </p>
          <Link
            href="/register?role=PROFESSIONAL"
            className="inline-flex rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            Create your page →
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
