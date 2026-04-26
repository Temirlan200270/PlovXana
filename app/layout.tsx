import type { Metadata } from "next";
import { AgentationDev } from "@/components/dev/AgentationDev";
import { BRAND_NAME } from "@/lib/branding";
import "./globals.css";
import { Inter } from "next/font/google";

const fontSans = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  // Базовый fallback. Страницы переопределяют tenant-aware metadata через generateMetadata.
  title: {
    default: BRAND_NAME,
    template: `%s · ${BRAND_NAME}`,
  },
  description:
    "ИП Абишев: сервис приёма и обработки заказов для кафе в Казахстане.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${fontSans.variable} font-sans antialiased`}>
        {children}
        <AgentationDev />
      </body>
    </html>
  );
}
