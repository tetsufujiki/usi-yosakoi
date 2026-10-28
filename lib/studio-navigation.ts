export const STUDIO_ARCHIVE_EVENT = "usi:archive-filter";

/** Open an existing team in the on-page archive without leaving the story. */
export function browseStudioArchive(team = "all") {
  window.dispatchEvent(new CustomEvent(STUDIO_ARCHIVE_EVENT, { detail: { team, year: "all" } }));
  document.getElementById("works")?.scrollIntoView({ block: "start" });
}
