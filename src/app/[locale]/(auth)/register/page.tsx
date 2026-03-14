import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import RegisterForm from "@/components/auth/RegisterForm";
import OAuthButton from "@/components/auth/OAuthButton";

export default async function RegisterPage() {
  const t = await getTranslations("Register");
  const tCommon = await getTranslations("Common");

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">{t("title")}</h1>
      <RegisterForm />

      <div className="my-4 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">{tCommon("or")}</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <OAuthButton provider="google" callbackUrl="/customer" />

      <p className="mt-6 text-center text-sm text-gray-500">
        {t("hasAccount")}{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          {t("signIn")}
        </Link>
      </p>
    </>
  );
}
