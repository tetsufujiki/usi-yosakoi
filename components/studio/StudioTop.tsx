"use client";

import type { ReactNode } from "react";
import type { StageArchive } from "@/lib/year-archive";
import { ArchiveBrowser } from "@/components/studio/ArchiveBrowser";
import { getOrbitWorks } from "@/lib/studio-orbit";
import { MarkOrbit } from "@/components/studio/MarkOrbit";
import { StudioHeader, StudioFooter } from "@/components/studio/StudioChrome";


export function StudioTop({ archive, children }: { archive: StageArchive; children?: ReactNode }) {
  const orbitWorks = getOrbitWorks(archive);

  return (
    <>
      <StudioHeader home />

      <main id="main-content">
        <section className="studio-hero" aria-labelledby="studio-title">
          <MarkOrbit works={orbitWorks} />
          <div className="studio-hero__copy">
            <div>
              <h1 id="studio-title">それぞれの想いに、<br />それぞれの<span className="studio-hero__sound">音</span>。</h1>
            </div>
          </div>
        </section>

        <section id="works" className="studio-archive" aria-label="年度とチームから作品を選ぶ">
          <ArchiveBrowser archive={archive} showSearch collapsibleSearch syncUrl />
          <div className="studio-archive__foot"><span>{archive.oldestYear}—{archive.newestYear} / {archive.workCount} WORKS</span></div>
          <div className="studio-archive__credit"><p>その年の演舞を撮影していただいたYouTube映像の中から、音声が聞き取りやすいものを使用させていただいております。</p><p>撮影してくださったカメラマンの皆さま、いつも本当にありがとうございます。</p></div>
        </section>
        {children}
      </main>
      <StudioFooter home />
    </>
  );
}
