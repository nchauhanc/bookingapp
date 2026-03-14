"use client";

import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const role = session?.user?.role;
  const t = useTranslations("Header");

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
      {/* Mobile menu button */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden rounded-lg p-2 text-gray-500 hover:bg-gray-100"
        aria-label="Toggle menu"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo (desktop) */}
      <span className="hidden lg:block text-lg font-bold text-indigo-600">BookVra</span>

      <div className="flex items-center gap-3">
        <LanguageSwitcher />
        {role && (
          <Badge
            label={role === "PROFESSIONAL" ? t("professional") : t("customer")}
            variant={role === "PROFESSIONAL" ? "blue" : "green"}
          />
        )}
        <Avatar name={session?.user?.name} image={session?.user?.image} size="sm" />
        <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
          {session?.user?.name ?? session?.user?.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          {t("signOut")}
        </Button>
      </div>
    </header>
  );
}
