import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import Avatar from "@/components/ui/Avatar";
import Badge from "@/components/ui/Badge";
import PublicBookingSection from "./PublicBookingSection";

interface Props {
  params: Promise<{ professionalId: string; locale: string }>;
}

/** Resolve a URL handle that may be a username slug OR a raw cuid. */
async function resolveProfessional(handle: string) {
  return prisma.user.findFirst({
    where: {
      OR: [{ username: handle }, { id: handle }],
      role: "PROFESSIONAL",
    },
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
  });
}

export async function generateMetadata({ params }: Props) {
  const { professionalId } = await params;
  const professional = await resolveProfessional(professionalId);
  if (!professional) return {};
  return {
    title: `Book with ${professional.name ?? "Professional"} — BookVra`,
    description: professional.speciality
      ? `Schedule a ${professional.speciality} appointment`
      : "Book an appointment",
  };
}

export default async function PublicSchedulePage({ params }: Props) {
  const { professionalId, locale } = await params;

  const [session, professional] = await Promise.all([
    getServerSession(authOptions),
    resolveProfessional(professionalId),
  ]);

  if (!professional) notFound();

  const t = await getTranslations("PublicPro");

  const slots = await prisma.slot.findMany({
    where: {
      professionalId: professional.id,
      isBooked: false,
      startTime: { gte: new Date() },
    },
    orderBy: { startTime: "asc" },
  });

  const serialisedSlots = slots.map((s) => ({
    id: s.id,
    startTime: s.startTime.toISOString(),
    endTime: s.endTime.toISOString(),
    isBooked: s.isBooked,
  }));

  const dashboardHref = session?.user?.role === "PROFESSIONAL" ? "/professional" : "/customer";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal public navbar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 backdrop-blur-md">
        <div className="max-w-3xl mx-auto flex items-center justify-between px-4 py-3">
          <Link href="/" className="text-xl font-bold text-indigo-600 shrink-0">
            BookVra
          </Link>
          <div className="flex items-center gap-1 sm:gap-2">
            {!session ? (
              <>
                {/* Sign in hidden on mobile */}
                <Link
                  href={`/login?callbackUrl=/${locale}/p/${professionalId}`}
                  className="hidden sm:block rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {t("signIn")}
                </Link>
                <span className="hidden sm:block h-4 w-px bg-gray-200 mx-1" aria-hidden="true" />
                <LanguageSwitcher />
                <Link
                  href={`/register?callbackUrl=/${locale}/p/${professionalId}`}
                  className="rounded-lg bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
                >
                  {t("signUp")}
                </Link>
              </>
            ) : (
              <>
                <LanguageSwitcher />
                <Link
                  href={dashboardHref}
                  className="rounded-lg px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  {t("dashboardLink")}
                </Link>
              </>
            )}
          </div>
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
          <h2 className="text-lg font-semibold text-gray-900">{t("availableSlots")}</h2>
          <PublicBookingSection
            slots={serialisedSlots}
            professionalId={professional.id}
            sessionRole={(session?.user?.role as string) ?? null}
            sessionUserId={session?.user?.id ?? null}
          />
        </div>
      </main>
    </div>
  );
}
