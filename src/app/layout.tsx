import type { Metadata, Viewport } from "next";
import { Heebo, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/data";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import JsonLd from "@/components/JsonLd";
import { organizationLd, websiteLd } from "@/lib/structured-data";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "700", "800", "900"],
});

const frank = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  variable: "--font-frank",
  weight: ["500", "700", "800", "900"],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://horka-fitness.vercel.app";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";
const OG_IMAGE = `${SITE_URL}${BASE_PATH}/images/gallery/gallery-08.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}${BASE_PATH}/`),
  title: {
    default: `${site.name} – ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "סטודיו הורקה",
    "אימוני כוח חולון",
    "סטודיו כושר חולון",
    "אימון אישי חולון",
    "אימונים בקבוצות קטנות",
    "אימון נשים חולון",
    "מאמן כושר אישי",
    "ליווי תזונתי",
    "חיטוב וחיזוק",
    "סטודיו בוטיק כושר",
  ],
  openGraph: {
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    type: "website",
    locale: "he_IL",
    siteName: site.name,
    url: `${SITE_URL}${BASE_PATH}/`,
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: `${site.name} – ${site.tagline}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} – ${site.tagline}`,
    description: site.description,
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#1f2224",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="he" dir="rtl">
      <body className={`${heebo.variable} ${frank.variable} antialiased`}>
        <JsonLd data={[organizationLd(), websiteLd()]} />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <WhatsAppFab />
      </body>
    </html>
  );
}
