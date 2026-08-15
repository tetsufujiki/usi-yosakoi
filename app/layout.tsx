import type { Metadata } from "next";
import "./globals.css";
import { ogImageUrl, siteDescription, siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: siteTitle,
    template: "%s｜UNITED STUDIO INC",
  },
  description: siteDescription,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "UNITED STUDIO INC",
    title: siteTitle,
    description: siteDescription,
    url: siteUrl,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: siteTitle,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [ogImageUrl],
  },
  icons: {
    icon: [
      {
        url: "/usi_1024.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
    shortcut: [
      {
        url: "/usi_1024.png",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/usi_1024.png",
        type: "image/png",
        sizes: "1024x1024",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="bg-background">
      <body>
        <a className="skip-link" href="#main-content">
          本文へ移動
        </a>
        {children}
      </body>
    </html>
  );
}
