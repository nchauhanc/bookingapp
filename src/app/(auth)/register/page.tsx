import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import OAuthButton from "@/components/auth/OAuthButton";

export default function RegisterPage() {
  return (
    <>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create account</h1>
      <RegisterForm />

      <div className="my-4 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">or</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <OAuthButton provider="google" callbackUrl="/customer" />

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-indigo-600 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
