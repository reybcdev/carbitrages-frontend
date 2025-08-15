import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Carbitrages - Revolutionary Car Buying Platform",
  description: "Experience transparent, instant car buying with arbitrage-based pricing and digital contracts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
