import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Archivo_Black } from "next/font/google";
import "./globals.css";
import { VisitBeacon } from "@/components/public/VisitBeacon";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

const archivoBlack = Archivo_Black({
  variable: "--font-display-heavy",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
});

const dm = DM_Sans({
  variable: "--font-dm",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  title: "Roberto · Content Editor",
  description:
    "Portfólio de Roberto — content editor focado em shorts e long form.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${bebas.variable} ${dm.variable} ${archivoBlack.variable}`}>
      <body>
        {children}
        <VisitBeacon />
      </body>
    </html>
  );
}
