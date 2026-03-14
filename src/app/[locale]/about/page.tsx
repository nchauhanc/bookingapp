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
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    // absolute: title already contains "BookVra" so we skip the "| BookVra" template
    title: { absolute: t("meta.title") },
    description: t("meta.description"),
  };
}

export default async function AboutPage() {
  const t = await getTranslations("About");

  return (
    <div className="min-h-screen bg-white">
      <PublicNav showBrowse />

      {/* Content */}
      <section className="py-20">
        <div className="max-w-2xl mx-auto px-6">
          <p className="text-xs text-gray-400 mb-2">{t("lastUpdated")}</p>
          <h1 className="text-4xl font-bold text-gray-900 mb-8">{t("title")}</h1>

          <div className="prose prose-gray max-w-none space-y-6 text-gray-600 leading-relaxed">
            <p>{t("p1")}</p>
            <p>{t("p2")}</p>
            <p>{t("p3")}</p>
            <p>{t("p4")}</p>
            <p>
              {t("contact")}{" "}
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
              {t("ctaSetup")}
            </Link>
            <Link
              href="/browse"
              className="inline-flex justify-center rounded-xl border border-gray-200 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              {t("ctaBrowse")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
