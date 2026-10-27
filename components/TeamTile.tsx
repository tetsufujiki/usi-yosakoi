import type { MouseEvent } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";
import { type ArchiveTeam, formatYearRange } from "@/lib/archive";
import { formatYears } from "@/lib/yosakoi";
import { TeamMark } from "./TeamMark";

type TeamTileProps = {
  team: ArchiveTeam;
  href: string;
  latestWork?: Pick<YosakoiWork, "years" | "workTitle">;
  /** "summary" lists years and work count; "latest" leads with the newest work. */
  detail?: "summary" | "latest";
  priority?: boolean;
  onSelect?: (event: MouseEvent<HTMLAnchorElement>) => void;
};

export function TeamTile({
  team,
  href,
  latestWork,
  detail = "summary",
  priority = false,
  onSelect,
}: TeamTileProps) {
  const yearRange = formatYearRange(team.oldestYear, team.newestYear);

  return (
    <a
      className="team-tile"
      href={href}
      onClick={onSelect}
      data-has-mark={team.mark ? "true" : "false"}
      data-detail={detail}
      data-team-id={team.id}
    >
      <span className="team-tile__face">
        {team.mark ? (
          <TeamMark mark={team.mark} size={160} priority={priority} />
        ) : (
          <span className="team-tile__type" aria-hidden="true">
            {team.name}
          </span>
        )}
      </span>

      <span className="team-tile__caption">
        <span className="team-tile__name">{team.name}</span>
        {detail === "latest" && latestWork ? (
          <span className="team-tile__work">
            <span className="team-tile__year">
              {formatYears(latestWork.years)}
            </span>
            <span className="team-tile__title">
              {latestWork.workTitle ? `「${latestWork.workTitle}」` : "演舞楽曲"}
            </span>
          </span>
        ) : (
          <>
            <span className="team-tile__meta">
              {yearRange}
              <span aria-hidden="true">・</span>
              <span className="sr-only">、</span>
              {team.workCount}作品
            </span>
            {latestWork?.workTitle ? (
              <span className="team-tile__latest">
                最新「{latestWork.workTitle}」
              </span>
            ) : null}
          </>
        )}
      </span>
    </a>
  );
}
