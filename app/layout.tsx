import type { Metadata } from "next";
import { Cormorant_Garamond, Hanken_Grotesk } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const hanken = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://luma.app"),
  title: "LUMA — Claridad para el corazón",
  description:
    "Pega la conversación y entiende qué está pasando de verdad. Tarot, inteligencia emocional y una coach con IA para tu vida amorosa. Prueba 3 días gratis.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${hanken.variable} h-full antialiased`}
    >
      <body className="min-h-dvh flex flex-col bg-bg text-text-primary">{children}</body>
    </html>
  );
}
