"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { Role } from "@/types";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("CUSTOMER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

    if (!res.ok) {
      setError(data.error ?? "Registration failed");
      setLoading(false);
      return;
    }

    // Auto sign-in after registration
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Registration succeeded but sign-in failed. Please log in.");
      router.push("/login");
      return;
    }

    router.push(role === "PROFESSIONAL" ? "/professional" : "/customer");
    router.refresh();
  }

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
