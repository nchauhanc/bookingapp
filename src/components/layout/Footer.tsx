import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <p className="text-xl font-bold text-white">BookVra</p>
            <p className="mt-2 text-sm leading-relaxed">{t("tagline")}</p>
          </div>

          {/* Product */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {t("product")}
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/pricing" className="hover:text-white transition-colors">{t("links.pricing")}</Link></li>
              <li><Link href="/browse" className="hover:text-white transition-colors">{t("links.browseProfessionals")}</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">{t("links.getStarted")}</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {t("company")}
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/about" className="hover:text-white transition-colors">{t("links.about")}</Link></li>
              <li><a href="mailto:hello@bookvra.com" className="hover:text-white transition-colors">{t("links.contact")}</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">
              {t("legal")}
            </p>
            <ul className="flex flex-col gap-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{t("links.privacy")}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{t("links.terms")}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-xs text-gray-600">
          {t("copyright", { year })}
        </div>
      </div>
    </footer>
  );
}
