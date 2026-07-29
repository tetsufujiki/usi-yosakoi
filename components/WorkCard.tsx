import type { KeyboardEvent } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";
import {
  formatYears,
  getYoutubeEmbedUrl,
  getYoutubeUrl,
} from "@/lib/yosakoi";
import { YosakoiThumbnail } from "./YosakoiThumbnail";

type WorkCardProps = {
  work: YosakoiWork;
  isActive: boolean;
  onTogglePlayback: () => void;
};

export function WorkCard({
  work,
  isActive,
  onTogglePlayback,
}: WorkCardProps) {
  const accessibleTitle = `${work.teamName}「${work.workTitle ?? "演舞楽曲"}」`;

  function handlePlaybackKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onTogglePlayback();
    }
  }

  return (
    <article className="work-card">
      <div className="work-card__media">
        {work.youtubeId && isActive ? (
          <div
            className="work-card__player"
            id={`archive-player-${work.id}`}
          >
            <iframe
              src={getYoutubeEmbedUrl(work.youtubeId, true)}
              title={`${accessibleTitle}を再生`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
            <button
              className="work-card__close"
              type="button"
              onClick={onTogglePlayback}
              onKeyDown={handlePlaybackKeyDown}
              aria-label={`${accessibleTitle}の再生を閉じる`}
              autoFocus
            >
              <span aria-hidden="true">×</span>
              閉じる
            </button>
          </div>
        ) : work.youtubeId ? (
          <button
            className="work-card__play"
            type="button"
            onClick={onTogglePlayback}
            onKeyDown={handlePlaybackKeyDown}
            aria-label={`${accessibleTitle}をページ内で再生`}
          >
            <YosakoiThumbnail work={work} />
          </button>
        ) : (
          <YosakoiThumbnail work={work} />
        )}
      </div>

      <div className="work-card__meta">
        <span>
          {formatYears(work.years)}
          {work.location ? ` / ${work.location}` : ""}
        </span>
        {work.youtubeId ? (
          <a
            href={getYoutubeUrl(work.youtubeId)}
            target="_blank"
            rel="noreferrer"
            aria-label={`${accessibleTitle}をYouTubeで開く`}
          >
            YouTubeで見る ↗
          </a>
        ) : (
          <span>作品情報</span>
        )}
      </div>
    </article>
  );
}
