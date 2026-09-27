import type { Metadata } from "next";
import { Inter } from "next/font/google";
import RootLayoutClient from "@/components/RootLayoutClient";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Engineering Intelligence Factory",
  description: "AI-powered Software Development Lifecycle Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-slate-50 dark:bg-slate-950 transition-colors`}>
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
