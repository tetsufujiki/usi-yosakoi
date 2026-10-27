import { yosakoiWorks } from "@/data/yosakoi-works";
import { buildStageArchive, OPEN_YEAR_COUNT } from "@/lib/year-archive";

export const stageArchive = buildStageArchive(yosakoiWorks);

const openYears = stageArchive.years.slice(0, OPEN_YEAR_COUNT);
export const openYearRange = `${openYears[0].year}–${openYears.at(-1)?.year}`;

const hotaeruYoutubeId = "RQyDJsJmaIg";

const hotaeru = stageArchive.works.find(
  (work) => work.youtubeId === hotaeruYoutubeId,
);

if (!hotaeru?.youtubeId) {
  throw new Error("The HOTAERU work was not found in the archive data.");
}

export const hotaeruWork = { ...hotaeru, youtubeId: hotaeru.youtubeId };
