import type { Metadata } from "next";
import { Geist, Geist_Mono, Comfortaa, Montserrat } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const comfortaa = Comfortaa({
  variable: "--font-h1",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  variable: "--font-sans-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kore Solutions — Perfil de Risco",
  description: "Conectamos investidores tradicionais ao universo blockchain de forma simples, segura e sem atritos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${comfortaa.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
