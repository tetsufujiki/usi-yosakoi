import type { YosakoiWork } from "@/data/yosakoi-works";
import { formatYears, getYoutubeUrl } from "@/lib/yosakoi";
import { YosakoiThumbnail } from "./YosakoiThumbnail";

type WorkCardProps = {
  work: YosakoiWork;
};

export function WorkCard({ work }: WorkCardProps) {
  const content = (
    <>
      <YosakoiThumbnail work={work} />
      <span className="work-card__meta">
        <span>
          {formatYears(work.years)}
          {work.location ? ` / ${work.location}` : ""}
        </span>
        {work.youtubeId ? <span>YouTubeで見る ↗</span> : <span>作品情報</span>}
      </span>
    </>
  );

  return (
    <article className="work-card">
      {work.youtubeId ? (
        <a
          className="work-card__link"
          href={getYoutubeUrl(work.youtubeId)}
          target="_blank"
          rel="noreferrer"
          aria-label={`${work.teamName}「${work.workTitle ?? "演舞楽曲"}」をYouTubeで見る`}
        >
          {content}
        </a>
      ) : (
        <div className="work-card__link">{content}</div>
      )}
    </article>
  );
}
