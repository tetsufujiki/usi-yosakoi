import type { StageArchive, StageWork } from "@/lib/year-archive";

export function getOrbitWorks(archive: StageArchive) {
  const teams = new Map<string, { latest: StageWork; count: number }>();
  for (const work of archive.works) {
    const team = teams.get(work.teamId);
    if (team) {
      team.count++;
      if (!team.latest.youtubeId && work.youtubeId) team.latest = work;
    }
    else teams.set(work.teamId, { latest: work, count: 1 });
  }
  return [...teams.values()]
    .filter(({ latest }) => latest.mark && latest.youtubeId)
    .sort((a, b) => b.count - a.count || a.latest.teamName.localeCompare(b.latest.teamName, "ja"))
    .map(({ latest }) => latest);
}

