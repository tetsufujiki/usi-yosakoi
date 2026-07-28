import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://yosakoi.united-studio.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "よさこい演舞楽曲制作｜UNITED STUDIO INC",
    template: "%s｜UNITED STUDIO INC",
  },
  description:
    "チームのテーマや演舞構成に合わせた、よさこいオリジナル楽曲を制作。作編曲、歌・楽器収録、ミックス、マスタリングまで一貫対応します。",
  robots: {
    index: false,
    follow: false,
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "YOSAKOI MUSIC — UNITED STUDIO INC",
    title: "よさこい演舞楽曲制作｜UNITED STUDIO INC",
    description:
      "チームの物語、地域性、演舞構成に合わせて、一曲の中に流れと見せ場を設計します。",
    url: siteUrl,
    images: [
      {
        url: "/og-yosakoi.png",
        width: 1200,
        height: 630,
        alt: "UNITED STUDIO / YOSAKOI よさこい演舞楽曲制作",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "よさこい演舞楽曲制作｜UNITED STUDIO INC",
    description:
      "チームの物語、地域性、演舞構成に合わせて、一曲の中に流れと見せ場を設計します。",
    images: ["/og-yosakoi.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <a className="skip-link" href="#main-content">
          本文へ移動
        </a>
        {children}
      </body>
    </html>
  );
}
