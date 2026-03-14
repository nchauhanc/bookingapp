"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface PublicNavProps {
  /** Which desktop-only links to show. Defaults to none. */
  showPricing?: boolean;
  showBrowse?: boolean;
}

export default function PublicNav({
  showPricing = false,
  showBrowse = false,
}: PublicNavProps) {
  const t = useTranslations("Nav");

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-indigo-600 shrink-0">
          BookVra
        </Link>

        {/* Right-side items */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Desktop-only text links */}
          {showPricing && (
            <Link
              href="/pricing"
              className="hidden sm:block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {t("pricing")}
            </Link>
          )}
          {showBrowse && (
            <Link
              href="/browse"
              className="hidden sm:block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
            >
              {t("browse")}
            </Link>
          )}

          {/* Sign in — hidden on mobile to avoid crowding */}
          <Link
            href="/login"
            className="hidden sm:block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            {t("signIn")}
          </Link>

          {/* Divider visible on desktop when there are left links */}
          <span className="hidden sm:block h-4 w-px bg-gray-200 mx-1" aria-hidden="true" />

          {/* Language switcher — always visible */}
          <LanguageSwitcher />

          {/* CTA — always visible */}
          <Link
            href="/register"
            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            {t("getStarted")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
