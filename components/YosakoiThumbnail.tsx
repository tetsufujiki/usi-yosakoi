import Image from "next/image";
import type { YosakoiWork } from "@/data/yosakoi-works";
import {
  formatYears,
  getArchiveTeamAbbreviation,
  getThumbnailTheme,
} from "@/lib/yosakoi";

type YosakoiThumbnailProps = {
  work: YosakoiWork;
  showYoutubeLabel?: boolean;
  priority?: boolean;
};

function getTextLength(value: string) {
  return Array.from(value.trim()).length;
}

function getTextSize(value: string, mediumAt: number, longAt: number) {
  const length = getTextLength(value);

  if (length >= longAt) return "long";
  if (length >= mediumAt) return "medium";
  return "short";
}

export function YosakoiThumbnail({
  work,
  showYoutubeLabel = true,
  priority = false,
}: YosakoiThumbnailProps) {
  const { variant, style } = getThumbnailTheme(work);
  const teamAbbreviation = getArchiveTeamAbbreviation(work.teamName);
  const teamSize = getTextSize(work.teamName, 7, 11);
  const titleSize = work.workTitle
    ? getTextSize(work.workTitle, 11, 17)
    : "none";
  const isDense =
    teamSize !== "short" && titleSize !== "short" && titleSize !== "none";

  return (
    <div
      className="work-thumbnail"
      data-thumbnail-variant={variant}
      data-team-size={teamSize}
      data-title-size={titleSize}
      data-density={isDense ? "dense" : "standard"}
      data-has-title={work.workTitle ? "true" : "false"}
      style={style}
      aria-hidden="true"
    >
      {work.thumbnailImage ? (
        <Image
          className="work-thumbnail__image"
          src={work.thumbnailImage}
          alt=""
          fill
          priority={priority}
          sizes="(max-width: 760px) 92vw, (max-width: 1200px) 45vw, 30vw"
        />
      ) : null}

      <span className="work-thumbnail__pattern work-thumbnail__pattern--one" />
      <span className="work-thumbnail__pattern work-thumbnail__pattern--two" />
      <span className="work-thumbnail__trace" />
      {teamAbbreviation ? (
        <span className="work-thumbnail__abbreviation">{teamAbbreviation}</span>
      ) : null}

      <div className="work-thumbnail__content">
        <p className="work-thumbnail__year">{formatYears(work.years)}</p>
        <div>
          <p className="work-thumbnail__team">{work.teamName}</p>
          {work.workTitle ? (
            <p className="work-thumbnail__title">「{work.workTitle}」</p>
          ) : null}
        </div>
      </div>

      {showYoutubeLabel && work.youtubeId ? (
        <span className="work-thumbnail__youtube">
          <span className="play-mark" />
        </span>
      ) : null}
    </div>
  );
}
