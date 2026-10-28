import type { YosakoiWork } from "@/data/yosakoi-works";
import { buildArchiveTeams, type ArchiveTeam } from "@/lib/archive";
import type { TeamMarkAsset } from "@/lib/team-marks";
import {
  formatYears,
  getArchiveTeamAbbreviation,
  sortWorksNewestFirst,
} from "@/lib/yosakoi";

export const FALLBACK_WORK_TITLE = "演舞楽曲";

/** How many of the newest years are open on the top page. */
export const OPEN_YEAR_COUNT = 3;

export type Nameplate = {
  lines: string[];
  /** Font size in container-inline units, so the name fills the card face. */
  size: number;
  latin?: string;
};

export type StageWork = {
  id: string;
  youtubeId?: string;
  teamId: string;
  teamName: string;
  workTitle?: string;
  /** Display label such as "2026" or "2025–26". */
  yearLabel: string;
  /** All performance years, retained for independent year filtering. */
  years: number[];
  /** The year this work is filed under in the archive. */
  archiveYear: number;
  mark?: TeamMarkAsset;
  nameplate?: Nameplate;
};

export type StageYear = {
  year: number;
  works: StageWork[];
};

export type StageArchive = {
  years: StageYear[];
  works: StageWork[];
  workCount: number;
  teamCount: number;
  oldestYear: number;
  newestYear: number;
};

/**
 * Line breaks for teams without a supplied mark. Presentation only: the
 * official name is unchanged, it is just set on two lines at natural breaks.
 */
const nameplateBreaks: Readonly<Record<string, string[]>> = {
  "さぬき一丁目一番地": ["さぬき", "一丁目一番地"],
  "北里三陸湧昇龍": ["北里三陸", "湧昇龍"],
};

function buildNameplate(team: ArchiveTeam | undefined, teamName: string) {
  const lines = nameplateBreaks[teamName] ?? teamName.split(/\s+/);
  const longestLine = Math.max(...lines.map((line) => [...line].length));

  return {
    lines,
    size: Math.min(24, Math.round((84 / longestLine) * 10) / 10),
    latin: getArchiveTeamAbbreviation(team?.archiveName ?? teamName),
  } satisfies Nameplate;
}

/**
 * A work performed across seasons (e.g. 2025–26) is filed once, under its
 * newest year, and always labelled with the full span.
 */
export function getArchiveYear(work: YosakoiWork) {
  return Math.max(...work.years);
}

export function buildStageArchive(works: YosakoiWork[]): StageArchive {
  const teams = buildArchiveTeams(works);
  const teamById = new Map(teams.map((team) => [team.id, team]));
  const worksByYear = new Map<number, StageWork[]>();

  for (const work of sortWorksNewestFirst(works)) {
    const team = teamById.get(work.teamId);
    const teamName = team?.name ?? work.teamName;
    const archiveYear = getArchiveYear(work);
    const stageWork: StageWork = {
      id: work.id,
      youtubeId: work.youtubeId,
      teamId: work.teamId,
      teamName,
      workTitle: work.workTitle,
      yearLabel: formatYears([...work.years].sort((a, b) => a - b)),
      years: [...work.years],
      archiveYear,
      mark: team?.mark,
      nameplate: team?.mark ? undefined : buildNameplate(team, teamName),
    };

    const yearWorks = worksByYear.get(archiveYear) ?? [];
    yearWorks.push(stageWork);
    worksByYear.set(archiveYear, yearWorks);
  }

  const years = [...worksByYear]
    .map(([year, yearWorks]) => ({ year, works: yearWorks }))
    .sort((a, b) => b.year - a.year);
  const allYears = works.flatMap((work) => work.years);

  return {
    years,
    works: years.flatMap((year) => year.works),
    workCount: works.length,
    teamCount: teams.length,
    oldestYear: Math.min(...allYears),
    newestYear: Math.max(...allYears),
  };
}

export function getWorkTitle(work: Pick<StageWork, "workTitle">) {
  return work.workTitle ?? FALLBACK_WORK_TITLE;
}

export function getPlayLabel(work: StageWork) {
  return `${work.teamName}「${getWorkTitle(work)}」（${work.yearLabel}）を再生`;
}
