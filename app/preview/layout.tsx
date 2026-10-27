import type { Metadata, Viewport } from "next";
import { Archivo, Noto_Sans_JP } from "next/font/google";
import "./v2.css";

const notoSansJp = Noto_Sans_JP({
  weight: ["400", "700", "900"],
  display: "swap",
  preload: false,
  variable: "--font-v2-ja",
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
  variable: "--font-v2-display",
});

export const metadata: Metadata = {
  title: "HERO比較プレビュー",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function PreviewLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className={`v2 ${notoSansJp.variable} ${archivo.variable}`}>
      {children}
    </div>
  );
}
