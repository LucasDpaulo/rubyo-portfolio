import type { Metadata } from "next";
import { Bebas_Neue, Inter_Tight } from "next/font/google";
import "./globals.css";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter_Tight({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roberto · Editor de Vídeo",
  description:
    "Portfólio de Roberto — editor de vídeo especialista em YouTube, Reels e TikTok.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
