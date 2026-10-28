import teamMarkLibrary from "@/data/team-marks.json";

/**
 * The supplied mark library is an image lookup table, not work data.
 * Marks are matched to archive teams by name (`name`, `archiveNames`,
 * `aliases`) so existing team IDs and work IDs never change.
 *
 * Optical sizing is already baked into every SVG — render them at the same
 * square size and never apply a second scale.
 */
export type TeamMarkAsset = {
  black: string;
  white: string;
};

export type TeamMark = TeamMarkAsset & {
  id: string;
  name: string;
  shortName?: string;
  archiveNames: string[];
  aliases: string[];
};

export const teamMarks: TeamMark[] = teamMarkLibrary.teams.map((record) => ({
  id: record.id,
  name: record.name,
  shortName: record.shortName,
  black: record.black,
  white: record.white,
  archiveNames: [...record.archiveNames],
  aliases: [...record.aliases],
}));

export function findTeamMark(teamName: string) {
  return teamMarks.find(
    (mark) =>
      mark.name === teamName ||
      mark.archiveNames.includes(teamName) ||
      mark.aliases.includes(teamName),
  );
}
