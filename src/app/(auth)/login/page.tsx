import Link from "next/link";
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

  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back</h1>

      {justVerified && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800 ring-1 ring-green-200">
          <span className="mt-0.5 text-base">✅</span>
          <span>
            <span className="font-semibold">Email verified!</span> You can now sign in to your account.
          </span>
        </div>
      )}

      <LoginForm callbackUrl={callbackUrl} />

      <div className="my-4 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <OAuthButton provider="google" callbackUrl="/" />

      <p className="mt-6 text-center text-sm text-gray-500">
        No account?{" "}
        <Link href="/register" className="font-medium text-indigo-600 hover:underline">
          Sign up
        </Link>
      </p>
    </>
  );
}
