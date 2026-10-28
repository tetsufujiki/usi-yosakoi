import type { Metadata } from "next";
import { StudioHome } from "@/components/studio/StudioHome";
import { siteDescription, siteIconUrl, siteTitle, siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: "よさこい演舞楽曲制作｜UNITED STUDIO INC",
  },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "UNITED STUDIO INC",
      url: siteUrl,
      logo: siteIconUrl,
      sameAs: ["https://united-studio.com"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteTitle,
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: "よさこい演舞楽曲制作",
      description: siteDescription,
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      areaServed: {
        "@type": "Country",
        name: "日本",
      },
      serviceType: "よさこい楽曲制作",
    },
  ],
};

export default function Home() {
  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} /><StudioHome /></>;
}
