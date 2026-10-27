import type { Metadata } from "next";
import { ArchiveIntro } from "@/components/v2/ArchiveIntro";
import { HeroCompareBar } from "@/components/v2/HeroCompareBar";
import { HeroFilm } from "@/components/v2/HeroFilm";
import { PlayerProvider } from "@/components/v2/PlayerProvider";
import { PreviewNextNote } from "@/components/v2/PreviewNextNote";
import { StageHeader } from "@/components/v2/StageHeader";
import { YearArchive } from "@/components/v2/YearArchive";
import { hotaeruWork, openYearRange, stageArchive } from "../stage-data";

export const metadata: Metadata = {
  title: "HERO B案：HOTAERU映像",
};

export default function HeroBPreview() {
  return (
    <PlayerProvider works={stageArchive.works}>
      <StageHeader />
      <main id="main-content">
        <HeroFilm work={hotaeruWork} archiveRange={openYearRange} />
        <section
          id="archive"
          className="v2-stage"
          aria-labelledby="archive-title"
        >
          <ArchiveIntro archive={stageArchive} titleId="archive-title" />
          <YearArchive years={stageArchive.years} heading="h3" />
        </section>
        <PreviewNextNote current="b" />
      </main>
      <HeroCompareBar current="b" />
    </PlayerProvider>
  );
}
