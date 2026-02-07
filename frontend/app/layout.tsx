import type { Metadata } from "next";
import "./globals.css";
import BodiFAB from "./components/BodiFAB";

export const metadata: Metadata = {
  title: "BODI | Peace of Mind Housing",
  description: "AI-Driven Housing Marketplace for Nigeria. Secure Escrow, Verified Agents.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        {children}
        <BodiFAB />
      </body>
    </html>
  );
}
