import type { ReactNode } from "react";
import { StudioHeader, StudioFooter } from "@/components/studio/StudioChrome";
import "@/app/preview/v2.css";
import "@/app/top-preview/studio.css";

export function StudioShell({ children }: { children: ReactNode }) {
  return <div className="studio"><StudioHeader /><main id="main-content">{children}</main><StudioFooter /></div>;
}
