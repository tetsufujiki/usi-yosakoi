// @ts-expect-error Node's native TypeScript runner requires explicit .ts extensions.
import { yosakoiTeams } from "../data/yosakoi-teams.ts";
// @ts-expect-error Node's native TypeScript runner requires explicit .ts extensions.
import { allYosakoiWorks, isPublishedYosakoiWork } from "../data/yosakoi-works.ts";
// @ts-expect-error Node's native TypeScript runner requires explicit .ts extensions.
import { featuredWorks as publicFeaturedWorks, yosakoiWorks as publicYosakoiWorks } from "../data/yosakoi-works.ts";

const minimumYear = 2008;
const maximumYear = new Date().getFullYear() + 1;
const maximumFeaturedWorks = 6;
const youtubeIdPattern = /^[A-Za-z0-9_-]{11}$/;
const teamIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const legacyIdPattern = /^work-\d+$/;
const newIdPattern = /^20\d{2}-[a-z0-9]+(?:-[a-z0-9]+)*$/;
const accentColorPattern = /^#[0-9A-Fa-f]{6}$/;
const allowedThumbnailVariants = new Set([
  "formation",
  "surge",
  "pulse",
  "flow",
]);

const errors: string[] = [];
const warnings: string[] = [];

function addDuplicateErrors(
  label: string,
  values: Array<{ key: string; owner: string }>,
) {
  const ownersByKey = new Map<string, string[]>();

  for (const { key, owner } of values) {
    const owners = ownersByKey.get(key) ?? [];
    owners.push(owner);
    ownersByKey.set(key, owners);
  }

  for (const [key, owners] of ownersByKey) {
    if (owners.length > 1) {
      errors.push(`${label} "${key}" is duplicated: ${owners.join(", ")}`);
    }
  }
}

addDuplicateErrors(
  "Team ID",
  yosakoiTeams.map((team) => ({ key: team.id, owner: team.name })),
);
addDuplicateErrors(
  "Team name",
  yosakoiTeams.map((team) => ({ key: team.name, owner: team.id })),
);

const teamById = new Map(yosakoiTeams.map((team) => [team.id, team]));

for (const team of yosakoiTeams) {
  if (!teamIdPattern.test(team.id)) {
    errors.push(`Team ID "${team.id}" is not a lowercase kebab-case slug.`);
  }

  if (!team.name.trim()) {
    errors.push(`Team "${team.id}" has an empty display name.`);
  }
}

addDuplicateErrors(
  "Work ID",
  allYosakoiWorks.map((work, index) => {
    const id = typeof work.id === "string" ? work.id : "";
    return { key: id || `<missing-${index + 1}>`, owner: id || `record ${index + 1}` };
  }),
);

addDuplicateErrors(
  "YouTube ID",
  allYosakoiWorks
    .filter((work) => typeof work.youtubeId === "string" && work.youtubeId)
    .map((work) => ({ key: work.youtubeId!, owner: work.id })),
);

const orderKeys = allYosakoiWorks
  .filter(
    (work) =>
      work.order !== undefined &&
      Array.isArray(work.years) &&
      work.years.length > 0,
  )
  .map((work) => ({
    key: `${Math.max(...work.years)}:${work.order}`,
    owner: work.id,
  }));
addDuplicateErrors("Order within newest year", orderKeys);

for (const work of allYosakoiWorks) {
  const workId = typeof work.id === "string" ? work.id : "";
  const teamId = typeof work.teamId === "string" ? work.teamId : "";
  const teamName = typeof work.teamName === "string" ? work.teamName : "";
  const workTitle =
    typeof work.workTitle === "string" ? work.workTitle : undefined;
  const youtubeId =
    typeof work.youtubeId === "string" ? work.youtubeId : undefined;
  const label = `[${workId || "missing-id"}]`;
  const status = work.status ?? "published";
  const isPublished = isPublishedYosakoiWork(work);

  if (!workId.trim()) {
    errors.push(`${label} id is required.`);
  } else if (
    !legacyIdPattern.test(workId) &&
    !newIdPattern.test(workId)
  ) {
    errors.push(
      `${label} id must be "work-<source-number>" or "YYYY-lowercase-kebab-case".`,
    );
  }

  if (status !== "published" && status !== "draft") {
    errors.push(`${label} status must be "published" or "draft".`);
  }

  if (!Array.isArray(work.years) || work.years.length === 0) {
    errors.push(`${label} years must contain at least one year.`);
  } else {
    const uniqueYears = new Set(work.years);
    const sortedYears = [...work.years].sort((a, b) => a - b);

    if (uniqueYears.size !== work.years.length) {
      errors.push(`${label} years contains duplicate values.`);
    }

    if (!work.years.every((year, index) => year === sortedYears[index])) {
      errors.push(`${label} years must be sorted in ascending order.`);
    }

    if (
      work.years.some(
        (year) =>
          !Number.isInteger(year) ||
          year < minimumYear ||
          year > maximumYear,
      )
    ) {
      errors.push(
        `${label} years must be integers from ${minimumYear} through ${maximumYear}.`,
      );
    }

    if (
      sortedYears.some(
        (year, index) => index > 0 && year !== sortedYears[index - 1] + 1,
      )
    ) {
      errors.push(`${label} multiple years must be consecutive.`);
    }
  }

  if (!teamId.trim()) {
    errors.push(`${label} teamId is required.`);
  } else if (!teamIdPattern.test(teamId)) {
    errors.push(`${label} teamId must be a lowercase kebab-case slug.`);
  }

  if (!teamName.trim()) {
    errors.push(`${label} teamName is required.`);
  }

  const registeredTeam = teamById.get(teamId);
  if (teamId) {
    if (!registeredTeam) {
      errors.push(
        `Unknown teamId "${teamId}" in work "${workId || "missing-id"}".\n` +
          "If this is a new team, add it to data/yosakoi-teams.ts first.",
      );
    } else if (registeredTeam.name !== teamName) {
      errors.push(
        `teamName mismatch for teamId "${teamId}" in work "${workId || "missing-id"}".\n` +
          `work teamName: "${teamName}"\n` +
          `registry name: "${registeredTeam.name}"\n` +
          "Update data/yosakoi-works.ts or data/yosakoi-teams.ts.",
      );
    }
  }

  if (!workTitle?.trim()) {
    warnings.push(
      `${label} workTitle is empty. Confirm that the title is genuinely unknown.`,
    );
  }

  if (isPublished && !youtubeId) {
    errors.push(`${label} published work requires youtubeId.`);
  }

  if (youtubeId) {
    if (
      youtubeId.includes("youtube.com") ||
      youtubeId.includes("youtu.be") ||
      /^https?:\/\//.test(youtubeId)
    ) {
      errors.push(
        `${label} youtubeId contains a URL. Store only the 11-character video ID.`,
      );
    } else if (!youtubeIdPattern.test(youtubeId)) {
      errors.push(`${label} youtubeId must be exactly 11 valid characters.`);
    }
  }

  if (work.featured && !isPublished) {
    errors.push(`${label} draft work cannot be featured.`);
  }

  if (
    work.order !== undefined &&
    (!Number.isInteger(work.order) || work.order < 0)
  ) {
    errors.push(`${label} order must be a non-negative integer.`);
  }

  if (
    work.thumbnailVariant !== undefined &&
    !allowedThumbnailVariants.has(work.thumbnailVariant)
  ) {
    errors.push(
      `${label} thumbnailVariant must be formation, surge, pulse, or flow.`,
    );
  }

  if (
    work.accentColor !== undefined &&
    !accentColorPattern.test(work.accentColor)
  ) {
    errors.push(
      `${label} accentColor must be a six-digit hex color such as #E66B42.`,
    );
  }
}

const publishedWorks = allYosakoiWorks.filter(isPublishedYosakoiWork);
const draftWorks = allYosakoiWorks.filter((work) => !isPublishedYosakoiWork(work));
const featuredWorks = publishedWorks.filter((work) => work.featured);

const expectedPublishedIds = publishedWorks.map((work) => work.id).join("\n");
const publicPublishedIds = publicYosakoiWorks.map((work) => work.id).join("\n");

if (expectedPublishedIds !== publicPublishedIds) {
  errors.push(
    "Public yosakoiWorks export does not exactly match the published records.",
  );
}

if (publicYosakoiWorks.some((work) => work.status === "draft")) {
  errors.push("Public yosakoiWorks export contains a draft record.");
}

if (
  publicFeaturedWorks.some(
    (work) => work.status === "draft" || !work.featured,
  )
) {
  errors.push("Public featuredWorks export contains a draft or non-featured record.");
}

if (featuredWorks.length > maximumFeaturedWorks) {
  errors.push(
    `Published featured works exceed the limit: ${featuredWorks.length}/${maximumFeaturedWorks}.`,
  );
}

function countBy(values: string[]) {
  return [...values.reduce((counts, value) => {
    counts.set(value, (counts.get(value) ?? 0) + 1);
    return counts;
  }, new Map<string, number>())].sort(([left], [right]) =>
    right.localeCompare(left, "ja"),
  );
}

const yearCounts = countBy(
  publishedWorks.flatMap((work) => work.years.map(String)),
);
const teamCounts = countBy(publishedWorks.map((work) => work.teamId));

console.log("Yosakoi archive data validation");
console.log("================================");
console.log(
  `Records: ${allYosakoiWorks.length} total / ${publishedWorks.length} published / ${draftWorks.length} draft`,
);
console.log(
  `Featured: ${featuredWorks.length}/${maximumFeaturedWorks} | Teams: ${teamById.size}`,
);
console.log(
  `Missing work titles: ${allYosakoiWorks.filter((work) => !work.workTitle?.trim()).length}`,
);
console.log("");
console.log("Published works by year:");
console.log(yearCounts.map(([year, count]) => `  ${year}: ${count}`).join("\n"));
console.log("");
console.log("Published works by team:");
console.log(
  teamCounts
    .map(([teamId, count]) => {
      const teamName = teamById.get(teamId)?.name ?? "unregistered";
      return `  ${teamId} (${teamName}): ${count}`;
    })
    .join("\n"),
);
console.log("");

if (warnings.length > 0) {
  console.warn(`WARNINGS (${warnings.length})`);
  for (const warning of warnings) {
    console.warn(`  - ${warning}`);
  }
  console.warn("");
} else {
  console.log("WARNINGS (0)");
  console.log("");
}

if (errors.length > 0) {
  console.error(`ERRORS (${errors.length})`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exitCode = 1;
} else {
  console.log("ERRORS (0)");
  console.log("Archive data is valid.");
}
