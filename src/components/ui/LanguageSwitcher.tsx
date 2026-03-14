"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 text-xs font-medium">
      <button
        onClick={() => router.replace(pathname, { locale: "en" })}
        className={
          locale === "en"
            ? "text-indigo-600 font-bold"
            : "text-gray-400 hover:text-gray-600 transition-colors"
        }
      >
        EN
      </button>
      <span className="text-gray-300">/</span>
      <button
        onClick={() => router.replace(pathname, { locale: "sv" })}
        className={
          locale === "sv"
            ? "text-indigo-600 font-bold"
            : "text-gray-400 hover:text-gray-600 transition-colors"
        }
      >
        SV
      </button>
    </div>
  );
}
