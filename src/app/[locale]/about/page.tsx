import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import Footer from "@/components/layout/Footer";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

export default async function AboutPage() {
  const t = await getTranslations("About");
  const tNav = await getTranslations("Nav");

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-indigo-600">BookVra</Link>
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <Link href="/browse" className="hidden sm:block rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              {tNav("browse")}
            </Link>
            <Link href="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors">
              {tNav("signIn")}
            </Link>
            <Link href="/register" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors">
              {tNav("getStarted")}
            </Link>
          </div>
        </div>
      </nav>

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
