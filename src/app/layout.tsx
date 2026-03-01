import type { Metadata } from "next";
import "./globals.css";
import SessionProvider from "@/components/layout/SessionProvider";

export const metadata: Metadata = {
  title: "BookSlot — Professional Scheduling",
  description: "Book appointments with professionals or manage your availability.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
