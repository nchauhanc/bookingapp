"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function OnboardingPage() {
  const { update: updateSession } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<"PROFESSIONAL" | "CUSTOMER" | null>(null);
  const [error, setError] = useState("");
  const t = useTranslations("Onboarding");

  async function chooseRole(role: "PROFESSIONAL" | "CUSTOMER") {
    setLoading(role);
    setError("");

    const res = await fetch("/api/onboarding", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });

    if (!res.ok) {
      setError(t("error"));
      setLoading(null);
      return;
    }

    // Refresh the JWT so needsOnboarding is cleared and role is updated
    await updateSession({ role });

    // Send to the right dashboard
    router.push(role === "PROFESSIONAL" ? "/professional" : "/customer");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Logo */}
        <p className="text-center text-2xl font-bold text-indigo-600 mb-8">BookVra</p>

        <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 text-center">
            {t("title")}
          </h1>
          <p className="mt-2 text-sm text-gray-500 text-center">
            {t("subtitle")}
          </p>

          {error && (
            <div className="mt-4 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Professional card */}
            <button
              onClick={() => chooseRole("PROFESSIONAL")}
              disabled={!!loading}
              className={[
                "group flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all",
                "hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                loading === "PROFESSIONAL"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white",
                loading && loading !== "PROFESSIONAL" ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <span className="text-5xl">🧑‍💼</span>
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-lg">
                  {loading === "PROFESSIONAL" ? t("pro.loading") : t("pro.label")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t("pro.desc")}
                </p>
              </div>
            </button>

            {/* Customer card */}
            <button
              onClick={() => chooseRole("CUSTOMER")}
              disabled={!!loading}
              className={[
                "group flex flex-col items-center gap-4 rounded-2xl border-2 p-6 text-left transition-all",
                "hover:border-indigo-500 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                loading === "CUSTOMER"
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 bg-white",
                loading && loading !== "CUSTOMER" ? "opacity-50 cursor-not-allowed" : "",
              ].join(" ")}
            >
              <span className="text-5xl">🙋</span>
              <div className="text-center">
                <p className="font-semibold text-gray-900 text-lg">
                  {loading === "CUSTOMER" ? t("customer.loading") : t("customer.label")}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t("customer.desc")}
                </p>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
