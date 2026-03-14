import type { Metadata } from "next";
import "./globals.css";

// metadataBase applies to every route — resolves relative OG/Twitter image URLs
export const metadata: Metadata = {
  metadataBase: new URL("https://www.bookvra.com"),
};

// Minimal root layout — locale-specific html/body/lang is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
