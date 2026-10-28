import { yosakoiWorks } from "@/data/yosakoi-works";
import { buildStageArchive } from "@/lib/year-archive";
import { PlayerProvider } from "@/components/v2/PlayerProvider";
import { StudioTop } from "@/components/studio/StudioTop";
import { StudioJourney } from "@/components/studio/StudioJourney";
import { StudioApproach, StudioInvitation } from "@/components/studio/StudioApproach";
import "@/app/preview/v2.css";
import "@/app/top-preview/studio.css";

const archive = buildStageArchive(yosakoiWorks);
const kokushiWorks = archive.works.filter((work) => work.teamId === "kokushi");
const film = kokushiWorks.find((work) => work.youtubeId === "RQyDJsJmaIg");
if (!film) throw new Error("Existing HOTAERU film missing from archive.");
const selections = [
  { id: "work-120774", title: "暁-AKATSUKI-" },
  { id: "work-120605", title: "はりまや橋で会いましょう" },
  { id: "work-120108", title: "感謝感激雨あられ" },
  { id: "work-119656", title: "土佐より" },
].map(({ id, title }) => {
  const work = kokushiWorks.find((item) => item.id === id);
  if (!work) throw new Error(`Existing selected work missing: ${id}`);
  return { ...work, workTitle: title };
});

export function StudioHome() {
  return <div className="studio"><PlayerProvider works={archive.works}><StudioTop archive={archive}>
    <StudioJourney film={film!} selected={selections} works={kokushiWorks} />
    <StudioApproach />
    <StudioInvitation />
  </StudioTop></PlayerProvider></div>;
}
