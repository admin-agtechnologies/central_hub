import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Syne } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AGT Platform — Assistant IA pour entreprises africaines",
  description: "AGT Platform donne à chaque entreprise un assistant intelligent disponible 24h/24. WhatsApp, agent vocal IA, gestion RDV.",
  keywords: ["assistant IA", "WhatsApp bot", "agent vocal IA", "AGT Platform", "Cameroun", "Afrique"],
  openGraph: {
    title: "AGT Platform — Assistant IA nouvelle génération",
    description: "Automatisez votre service client avec un assistant IA disponible 24h/24.",
    siteName: "AGT Platform",
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/logo.png",          sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${plusJakartaSans.variable} ${syne.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}