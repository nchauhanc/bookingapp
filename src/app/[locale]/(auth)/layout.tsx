import { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const t = await getTranslations("AuthLayout");

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <span className="text-3xl font-bold text-indigo-600">BookVra</span>
          <p className="mt-1 text-sm text-gray-500">{t("tagline")}</p>
        </div>
        {/* Card */}
        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          {children}
        </div>
      </div>
    </div>
  );
}
