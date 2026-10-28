import { yosakoiTeams } from "@/data/yosakoi-teams";
import type { YosakoiWork } from "@/data/yosakoi-works";
import { findTeamMark, type TeamMarkAsset } from "@/lib/team-marks";
import { compareArchiveTeamNames, sortWorksNewestFirst } from "@/lib/yosakoi";

export type ArchiveTeam = {
  /** Existing team ID from data/yosakoi-teams.ts (never renamed). */
  id: string;
  /** Official display name: the mark library `name` when a mark exists. */
  name: string;
  /** Name as stored in the existing archive data. */
  archiveName: string;
  shortName?: string;
  aliases: string[];
  mark?: TeamMarkAsset;
  workCount: number;
  oldestYear: number;
  newestYear: number;
  latestWorkId: string;
};

export type PresentedWork = YosakoiWork & {
  teamLabel: string;
  mark?: TeamMarkAsset;
};

export type YearSummary = {
  year: number;
  count: number;
};

const registryNameById = new Map(
  yosakoiTeams.map((team) => [team.id, team.name]),
);

export function buildArchiveTeams(works: YosakoiWork[]): ArchiveTeam[] {
  const worksByTeam = new Map<string, YosakoiWork[]>();

  for (const work of works) {
    const teamWorks = worksByTeam.get(work.teamId) ?? [];
    teamWorks.push(work);
    worksByTeam.set(work.teamId, teamWorks);
  }

  return [...worksByTeam]
    .map(([teamId, teamWorks]) => {
      const archiveName = registryNameById.get(teamId) ?? teamWorks[0].teamName;
      const mark = findTeamMark(archiveName);
      const years = teamWorks.flatMap((work) => work.years);
      const [latestWork] = sortWorksNewestFirst(teamWorks);
      const aliases = mark
        ? [...new Set([...mark.archiveNames, ...mark.aliases])].filter(
            (alias) => alias !== mark.name,
          )
        : [];

      return {
        id: teamId,
        name: mark?.name ?? archiveName,
        archiveName,
        shortName: mark?.shortName,
        aliases,
        mark: mark ? { black: mark.black, white: mark.white } : undefined,
        workCount: teamWorks.length,
        oldestYear: Math.min(...years),
        newestYear: Math.max(...years),
        latestWorkId: latestWork.id,
      } satisfies ArchiveTeam;
    })
    .sort((a, b) => compareArchiveTeamNames(a.archiveName, b.archiveName));
}

export function presentWorks(
  works: YosakoiWork[],
  teams: ArchiveTeam[],
): PresentedWork[] {
  const teamById = new Map(teams.map((team) => [team.id, team]));

  return works.map((work) => {
    const team = teamById.get(work.teamId);

    return {
      ...work,
      teamLabel: team?.name ?? work.teamName,
      mark: team?.mark,
    };
  });
}

export function getYearSummaries(works: YosakoiWork[]): YearSummary[] {
  const counts = new Map<number, number>();

  for (const work of works) {
    for (const year of work.years) {
      counts.set(year, (counts.get(year) ?? 0) + 1);
    }
  }

  return [...counts]
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year - a.year);
}

export function formatYearRange(oldestYear: number, newestYear: number) {
  return oldestYear === newestYear
    ? String(oldestYear)
    : `${oldestYear}–${newestYear}`;
}

export function normalizeSearchText(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja");
}

export function getTeamSearchText(team: ArchiveTeam) {
  return normalizeSearchText(
    [team.name, team.archiveName, team.shortName ?? "", ...team.aliases].join(
      " ",
    ),
  );
}

export function getTeamHref(teamId: string) {
  return `/archive?team=${encodeURIComponent(teamId)}`;
}

export function getYearHref(year: number) {
  return `/archive?view=years&year=${year}`;
}
