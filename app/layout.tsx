import type { Metadata } from "next";
import { AgentationDev } from "@/components/dev/AgentationDev";
import { OrnamentSprite } from "@/components/ornaments/OrnamentSprite";
import { BRAND_NAME } from "@/lib/branding";
import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";

const fontSerif = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-serif",
  weight: ["400", "500"],
  style: ["normal", "italic"],
});

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  // Базовый fallback. Страницы переопределяют tenant-aware metadata через generateMetadata.
  title: {
    default: BRAND_NAME,
    template: `%s · ${BRAND_NAME}`,
  },
  description: "Халяльная кухня, доставка, бронь столов. Павлодар.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${fontSerif.variable} ${fontSans.variable} antialiased`}>
        {children}
        <OrnamentSprite />
        <AgentationDev />
      </body>
    </html>
  );
}
