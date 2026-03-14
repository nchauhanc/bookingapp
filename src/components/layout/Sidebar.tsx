"use client";

import { usePathname } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = session?.user?.role;
  const t = useTranslations("Sidebar");

  const professionalLinks = [
    { href: "/professional" as const, label: t("pro.dashboard"), icon: "🏠" },
    { href: "/professional/availability" as const, label: t("pro.availability"), icon: "📅" },
    { href: "/professional/bookings" as const, label: t("pro.bookings"), icon: "📋" },
    { href: "/professional/profile" as const, label: t("pro.profile"), icon: "👤" },
  ];

  const customerLinks = [
    { href: "/customer" as const, label: t("customer.dashboard"), icon: "🏠" },
    { href: "/customer/browse" as const, label: t("customer.browse"), icon: "🔍" },
    { href: "/customer/bookings" as const, label: t("customer.bookings"), icon: "📋" },
  ];

  const links = role === "PROFESSIONAL" ? professionalLinks : customerLinks;

  return (
    <nav className="flex flex-col gap-1 p-4">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onClose}
            className={[
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
              active
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
            ].join(" ")}
          >
            <span className="text-base">{link.icon}</span>
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
