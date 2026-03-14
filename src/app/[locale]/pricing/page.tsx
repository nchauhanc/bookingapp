import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/layout/Footer";
import PublicNav from "@/components/layout/PublicNav";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Pricing" });
  return {
    title: t("meta.title"),          // template → "Simple Free Pricing | BookVra"
    description: t("meta.description"),
  };
}

export default async function PricingPage() {
  const t = await getTranslations("Pricing");

  const features = t.raw("features") as string[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <div className="min-h-screen bg-white">
      <PublicNav showBrowse />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t("title")}</h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            {t("subtitle")}
          </p>
        </div>
      </section>

      {/* Pricing card */}
      <section className="py-20">
        <div className="max-w-md mx-auto px-6">
          <div className="rounded-2xl bg-white ring-2 ring-indigo-600 shadow-xl overflow-hidden">
            {/* Card header */}
            <div className="bg-indigo-600 px-8 py-6 text-center">
              <p className="text-sm font-semibold text-indigo-200 uppercase tracking-widest mb-1">{t("tier.label")}</p>
              <p className="text-5xl font-bold text-white">{t("tier.price")}</p>
              <p className="mt-1 text-indigo-200 text-sm">{t("tier.period")}</p>
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
                  {t("ctaButton")}
                </Link>
              </div>
            </div>
          </div>

          {/* Paid plans note */}
          <p className="mt-6 text-center text-sm text-gray-500">
            {t("paidNote")}
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-gray-50 border-t border-gray-100 py-20">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">{t("faq.title")}</h2>
          <div className="flex flex-col gap-6">
            {faqItems.map((item) => (
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
