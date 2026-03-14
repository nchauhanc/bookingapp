import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import LoginForm from "@/components/auth/LoginForm";
import OAuthButton from "@/components/auth/OAuthButton";

interface LoginPageProps {
  searchParams: Promise<{ verified?: string; callbackUrl?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const justVerified = params.verified === "true";
  // Only allow relative paths to prevent open-redirect attacks
  const callbackUrl =
    params.callbackUrl?.startsWith("/") ? params.callbackUrl : undefined;

  const t = await getTranslations("Login");
  const tCommon = await getTranslations("Common");

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("title")}</h1>

      {justVerified && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 ring-1 ring-green-200">
          <span className="mt-0.5 text-base">✅</span>
          <span>
            <span className="font-semibold">{t("verified.bold")}</span> {t("verified.rest")}
          </span>
        </div>
      )}

      <LoginForm callbackUrl={callbackUrl} />

      <div className="my-4 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">{tCommon("or")}</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <OAuthButton provider="google" callbackUrl={callbackUrl ?? "/"} />

      <p className="mt-6 text-center text-sm text-gray-500">
        {t("noAccount")}{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline">
          {t("signUp")}
        </Link>
      </p>
    </>
  );
}
