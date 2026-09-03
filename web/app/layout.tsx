import type { Metadata } from "next";
import { Geist, IBM_Plex_Mono, Fraunces } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { GA_ID } from "@/lib/ga";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

const TITLE = "Luma: Verifiable AI for Biomedical Information";
const DESCRIPTION =
  "Luma checks every claim in an AI medical answer against the primary literature. Real citations, or an honest flag.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.useluma.io"),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    url: "https://www.useluma.io",
    siteName: "Luma",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${plexMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Analytics />
        {GA_ID && <GoogleAnalytics gaId={GA_ID} />}
      </body>
    </html>
  );
}
