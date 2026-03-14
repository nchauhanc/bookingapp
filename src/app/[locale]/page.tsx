import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/layout/Footer";
import PublicNav from "@/components/layout/PublicNav";

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await getServerSession(authOptions);
  if (session?.user?.role === "PROFESSIONAL") redirect(`/${locale}/professional`);
  if (session?.user?.role === "CUSTOMER") redirect(`/${locale}/customer`);

  const t = await getTranslations("Landing");

  const proSteps = t.raw("howItWorks.proSteps") as { title: string; desc: string }[];
  const customerSteps = t.raw("howItWorks.customerSteps") as { title: string; desc: string }[];
  const professions = t.raw("whoItsFor.professions") as { icon: string; label: string }[];
  const stats = t.raw("stats") as { stat: string; label: string }[];

  return (
    <div className="min-h-screen bg-white">

      <PublicNav showPricing showBrowse />

      {/* ── Hero ── */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-indigo-100 px-4 py-1.5 text-xs font-medium text-indigo-700 mb-6">
            {t("badge")}
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 leading-tight mb-6">
            {t("hero.title1")}
            <br />
            <span className="text-indigo-600">{t("hero.title2")}</span>
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10">
            {t("hero.desc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="rounded-xl bg-indigo-600 px-8 py-4 text-base font-semibold text-white hover:bg-indigo-700 transition-colors">
              {t("hero.cta1")}
            </Link>
            <Link href="/browse" className="rounded-xl border border-gray-200 bg-white px-8 py-4 text-base font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              {t("hero.cta2")}
            </Link>
          </div>
        </div>
      </section>

      {/* ── Mock UI Preview ── */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">{t("preview.title")}</h2>
            <p className="mt-3 text-gray-500">{t("preview.subtitle")}</p>
          </div>

          {/* Mock booking page */}
          <div className="max-w-2xl mx-auto rounded-2xl bg-white shadow-xl ring-1 ring-gray-200 overflow-hidden">
            {/* Mock nav bar */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
              <span className="text-sm font-bold text-indigo-600">BookVra</span>
              <div className="flex gap-2">
                <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs text-gray-500">{t("preview.signIn" as never) || "Sign in"}</span>
                <span className="rounded-md bg-indigo-600 px-2.5 py-1 text-xs text-white">{t("preview.signUp" as never) || "Sign up"}</span>
              </div>
            </div>

            <div className="p-5">
              {/* Mock professional card */}
              <div className="flex items-center gap-4 rounded-xl bg-gray-50 p-4 mb-5">
                <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center text-2xl shrink-0">🧑‍💼</div>
                <div>
                  <p className="font-semibold text-gray-900">{t("preview.proName")}</p>
                  <span className="inline-block rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700">{t("preview.speciality")}</span>
                  <p className="mt-1 text-xs text-gray-500 italic">&ldquo;{t("preview.tagline")}&rdquo;</p>
                </div>
              </div>

              {/* Mock calendar */}
              <p className="text-sm font-semibold text-gray-700 mb-3">{t("preview.availableSlots")}</p>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {[
                  { day: "Mon 17", slots: ["09:00", "11:00"] },
                  { day: "Tue 18", slots: ["10:00", "14:00", "16:00"] },
                  { day: "Wed 19", slots: ["09:00"] },
                  { day: "Thu 20", slots: ["11:00", "15:00"] },
                ].map((col) => (
                  <div key={col.day} className="flex flex-col gap-1.5">
                    <p className="text-center text-xs font-medium text-gray-500 mb-1">{col.day}</p>
                    {col.slots.map((s) => (
                      <div key={s} className="cursor-pointer rounded-lg bg-emerald-50 px-2 py-2 text-center text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 hover:bg-emerald-100 transition-colors">
                        {s}
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl bg-indigo-600 py-3 text-center text-sm font-semibold text-white opacity-50 cursor-default">
                {t("preview.selectSlot")}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900">{t("howItWorks.title")}</h2>
            <p className="mt-3 text-gray-500">{t("howItWorks.subtitle")}</p>
          </div>

          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2">
            {/* Professional side */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-6">{t("howItWorks.forPros")}</p>
              <div className="flex flex-col gap-6">
                {proSteps.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-bold text-indigo-600">
                      {i + 1}
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
                  {t("howItWorks.proCtaBtn")}
                </Link>
              </div>
            </div>

            {/* Customer side */}
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600 mb-6">{t("howItWorks.forCustomers")}</p>
              <div className="flex flex-col gap-6">
                {customerSteps.map((s, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="shrink-0 h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-sm font-bold text-emerald-600">
                      {i + 1}
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
                  {t("howItWorks.customerCtaBtn")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Who it's for ── */}
      <section className="bg-gray-50 py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{t("whoItsFor.title")}</h2>
          <p className="text-gray-500 mb-12 max-w-xl mx-auto">
            {t("whoItsFor.subtitle")}
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {professions.map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
                <span className="text-3xl">{p.icon}</span>
                <p className="text-sm font-medium text-gray-700">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16 text-center">
            {stats.map((item) => (
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
            {t("cta.title")}
          </h2>
          <p className="text-indigo-200 mb-8 max-w-lg mx-auto">
            {t("cta.subtitle")}
          </p>
          <Link href="/register" className="inline-flex rounded-xl bg-white px-8 py-4 text-base font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors">
            {t("cta.button")}
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
