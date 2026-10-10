import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CleanGo — Cleaning, Made Easy",
  description:
    "Pesan layanan kebersihan rumah dan kantor dengan praktis, transparan, dan terpercaya bersama CleanGo.",
  applicationName: "CleanGo",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
