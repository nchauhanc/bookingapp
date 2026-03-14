import "./globals.css";

// Minimal root layout — locale-specific html/body/lang is in [locale]/layout.tsx
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
