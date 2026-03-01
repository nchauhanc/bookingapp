import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";
import OAuthButton from "@/components/auth/OAuthButton";

export default function LoginPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Welcome back</h1>
      <LoginForm />

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
