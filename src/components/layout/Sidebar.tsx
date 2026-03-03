"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

const professionalLinks = [
  { href: "/professional", label: "Dashboard", icon: "🏠" },
  { href: "/professional/availability", label: "Availability", icon: "📅" },
  { href: "/professional/bookings", label: "Bookings", icon: "📋" },
  { href: "/professional/profile", label: "My Profile", icon: "👤" },
];

const customerLinks = [
  { href: "/customer", label: "Dashboard", icon: "🏠" },
  { href: "/customer/browse", label: "Browse", icon: "🔍" },
  { href: "/customer/bookings", label: "My Bookings", icon: "📋" },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const links =
    session?.user?.role === "PROFESSIONAL" ? professionalLinks : customerLinks;

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
