"use client";

import { useState } from "react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { Role } from "@/types";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      return;
    }

    // Registration succeeded — show "check your email" panel
    setEmailSent(true);
  }

  async function handleResend() {
    setResendMessage("");
    setResendLoading(true);

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setResendLoading(false);
    setResendMessage(data.message ?? data.error ?? "Something went wrong.");
  }

  // ── Email-sent confirmation panel ──────────────────────────────────────────
  if (emailSent) {
    return (
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-4xl">
          ✉️
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-500">
            We sent a verification link to{" "}
            <span className="font-medium text-gray-700">{email}</span>.
            <br />
            Click the link to activate your account.
          </p>
        </div>

        {resendMessage && (
          <p className="rounded-lg bg-gray-50 px-4 py-2 text-sm text-gray-600">
            {resendMessage}
          </p>
        )}

        <div className="flex w-full flex-col gap-2 sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="flex-1"
            loading={resendLoading}
            onClick={handleResend}
          >
            Resend email
          </Button>
          <Link
            href="/login"
            className="flex flex-1 items-center justify-center rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    );
  }

  // ── Registration form ──────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <ErrorMessage message={error} />}

      <Input
        label="Full name"
        id="name"
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Jane Doe"
        required
        autoComplete="name"
      />
      <Input
        label="Email"
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        autoComplete="email"
      />
      <Input
        label="Password"
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Min. 8 characters"
        required
        minLength={8}
        autoComplete="new-password"
      />

      {/* Role selector */}
      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-gray-700">I am a…</span>
        <div className="grid grid-cols-2 gap-3">
          {(["CUSTOMER", "PROFESSIONAL"] as Role[]).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={[
                "rounded-xl border-2 px-4 py-3 text-sm font-medium transition-colors text-left",
                role === r
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 text-gray-600 hover:border-gray-300",
              ].join(" ")}
            >
              {r === "CUSTOMER" ? (
                <>
                  <span className="block text-xl mb-1">👤</span>
                  Customer
                  <span className="block text-xs text-gray-500 font-normal mt-0.5">Book appointments</span>
                </>
              ) : (
                <>
                  <span className="block text-xl mb-1">💼</span>
                  Professional
                  <span className="block text-xs text-gray-500 font-normal mt-0.5">Offer services</span>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      <Button type="submit" size="lg" className="w-full" loading={loading}>
        Create account
      </Button>
    </form>
  );
}
