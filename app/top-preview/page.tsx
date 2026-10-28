import type { Metadata } from "next";
import { StudioHome } from "@/components/studio/StudioHome";

export const metadata: Metadata = {
  title: "USI — トップデザイン",
  robots: { index: false, follow: false },
};

export default function StudioPreview() { return <StudioHome />; }
