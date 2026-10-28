import type { Metadata } from "next";
import { ArchiveIntro } from "@/components/v2/ArchiveIntro";
import { HeroCompareBar } from "@/components/v2/HeroCompareBar";
import { PlayerProvider } from "@/components/v2/PlayerProvider";
import { PreviewNextNote } from "@/components/v2/PreviewNextNote";
import { StageHeader } from "@/components/v2/StageHeader";
import { YearArchive } from "@/components/v2/YearArchive";
import { stageArchive } from "../stage-data";

export const metadata: Metadata = {
  title: "HERO A案：年度別アーカイブ",
};

export default function HeroAPreview() {
  return (
    <PlayerProvider works={stageArchive.works}>
      <StageHeader />
      <main id="main-content">
        <section
          id="archive"
          className="v2-stage v2-stage--hero"
          aria-labelledby="archive-title"
        >
          <YearArchive
            years={stageArchive.years}
            heading="h2"
            leadAside={
              <ArchiveIntro
                archive={stageArchive}
                as="hero"
                titleId="archive-title"
              />
            }
          />
        </section>
        <PreviewNextNote current="a" />
      </main>
      <HeroCompareBar current="a" />
    </PlayerProvider>
  );
}
