"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

type ErrorType = "invalid" | "expired" | null;

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error") as ErrorType;

  const [email, setEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  // No error param means the GET handler redirected here unexpectedly (edge case)
  const isLoading = !errorParam && typeof window !== "undefined" && !searchParams.get("error");

  async function handleResend(e: React.FormEvent) {
    e.preventDefault();
    setResendMessage("");
    setResendError("");
    setResendLoading(true);

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setResendLoading(false);

    if (res.ok) {
      setResendMessage(data.message ?? "Verification email sent!");
    } else {
      setResendError(data.error ?? "Something went wrong. Please try again.");
    }
  }

  if (!errorParam) {
    // Shouldn't normally be reached — GET handler redirects away
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <Spinner className="h-8 w-8 text-indigo-500" />
        <p className="text-sm text-gray-500">Verifying your email…</p>
      </div>
    );
  }

  const isExpired = errorParam === "expired";

  return (
    <div className="flex flex-col items-center gap-6 py-4 text-center">
      {/* Icon */}
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-4xl">
        {isExpired ? "⏰" : "❌"}
      </div>

      {/* Heading */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          {isExpired ? "Link expired" : "Invalid link"}
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {isExpired
            ? "This verification link has expired. Verification links are valid for 24 hours."
            : "This verification link is invalid or has already been used."}
        </p>
      </div>

      {/* Resend form */}
      {!resendMessage && (
        <form onSubmit={handleResend} className="flex w-full flex-col gap-3">
          <p className="text-sm font-medium text-gray-700">
            Enter your email to receive a new verification link:
          </p>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
          {resendError && (
            <p className="text-sm text-red-600">{resendError}</p>
          )}
          <Button type="submit" loading={resendLoading} className="w-full">
            Send new verification email
          </Button>
        </form>
      )}

      {/* Success state */}
      {resendMessage && (
        <div className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700 w-full">
          ✅ {resendMessage}
        </div>
      )}

      <Link
        href="/login"
        className="text-sm text-indigo-600 hover:underline"
      >
        Back to sign in
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-sm ring-1 ring-gray-200">
        <Link href="/" className="mb-6 inline-block text-lg font-bold text-indigo-600">
          BookSlot
        </Link>
        <Suspense
          fallback={
            <div className="flex flex-col items-center gap-4 py-8">
              <Spinner className="h-8 w-8 text-indigo-500" />
            </div>
          }
        >
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
}
