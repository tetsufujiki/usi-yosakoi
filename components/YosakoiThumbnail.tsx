import Image from "next/image";
import type { YosakoiWork } from "@/data/yosakoi-works";
import { formatYears, getThumbnailTheme } from "@/lib/yosakoi";

type YosakoiThumbnailProps = {
  work: YosakoiWork;
  showYoutubeLabel?: boolean;
  priority?: boolean;
};

export function YosakoiThumbnail({
  work,
  showYoutubeLabel = true,
  priority = false,
}: YosakoiThumbnailProps) {
  const { variant, style } = getThumbnailTheme(work);

  return (
    <div
      className="work-thumbnail"
      data-thumbnail-variant={variant}
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
          YouTube
        </span>
      ) : null}
    </div>
  );
}
