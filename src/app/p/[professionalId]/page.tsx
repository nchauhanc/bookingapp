import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import PublicBookingSection from "./PublicBookingSection";

interface Props {
  params: Promise<{ professionalId: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { professionalId } = await params;
  const professional = await prisma.user.findFirst({
    where: { id: professionalId, role: "PROFESSIONAL" },
    select: { name: true, speciality: true },
  });
  if (!professional) return {};
  return {
    title: `Book with ${professional.name ?? "Professional"} — BookSlot`,
    description: professional.speciality
      ? `Schedule a ${professional.speciality} appointment`
      : "Book an appointment",
  };
}

export default async function PublicSchedulePage({ params }: Props) {
  const { professionalId } = await params;

  const [session, professional, slots] = await Promise.all([
    getServerSession(authOptions),
    prisma.user.findFirst({
      where: { id: professionalId, role: "PROFESSIONAL" },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        speciality: true,
        tagline: true,
        role: true,
      },
    }),
    prisma.slot.findMany({
      where: {
        professionalId,
        isBooked: false,
        startTime: { gte: new Date() },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  if (!professional) notFound();

  // Serialise dates to strings for the client component
  const serialisedSlots = slots.map((s) => ({
    id: s.id,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    isBooked: s.isBooked,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal public navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-indigo-600">
            BookSlot
          </Link>
          {!session ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
              >
                Sign up
              </Link>
            </div>
          ) : (
            <Link
              href={session.user.role === "PROFESSIONAL" ? "/professional" : "/customer"}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              Dashboard →
            </Link>
          )}
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
        {/* Professional profile header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white rounded-2xl p-6 shadow-sm ring-1 ring-gray-200">
          <Avatar name={professional.name} image={professional.image} size="lg" />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900">
              {professional.name ?? "Professional"}
            </h1>
            {professional.speciality && (
              <div className="mt-1">
                <Badge label={professional.speciality} variant="blue" />
              </div>
            )}
            {professional.tagline && (
              <p className="mt-1.5 text-sm text-gray-500 italic">
                &ldquo;{professional.tagline}&rdquo;
              </p>
            )}
            {professional.bio && (
              <p className="mt-2 text-sm text-gray-500">{professional.bio}</p>
            )}
          </div>
        </div>

        {/* Schedule section */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Available Slots</h2>
          <PublicBookingSection
            slots={serialisedSlots}
            professionalId={professionalId}
            sessionRole={(session?.user?.role as string) ?? null}
            sessionUserId={session?.user?.id ?? null}
          />
        </div>
      </main>
    </div>
  );
}
