import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Syne, Work_Sans } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const workSans = Work_Sans({ variable: "--font-work-sans", subsets: ["latin"], display: "swap" });
const syne = Syne({ variable: "--font-syne", subsets: ["latin"], weight: ["700", "800"], display: "swap" });
const jetbrainsMono = JetBrains_Mono({ variable: "--font-jetbrains-mono", subsets: ["latin"], weight: ["500"], display: "swap" });

export const metadata: Metadata = {
  title: { default: "Taaru · Atelier de couture", template: "%s · Taaru" },
  description: "Clients, mesures, commandes, acomptes et messages WhatsApp pour les ateliers de couture.",
  applicationName: "Taaru",
  appleWebApp: { capable: true, title: "Taaru", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2c3a8c" },
    { media: "(prefers-color-scheme: dark)", color: "#1c2350" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className={`${workSans.variable} ${syne.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-dvh">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
