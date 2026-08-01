"use client";

import { useEffect, useState } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";
import {
  formatYears,
  getYoutubeEmbedUrl,
  getYoutubeUrl,
} from "@/lib/yosakoi";
import { YosakoiThumbnail } from "./YosakoiThumbnail";

type SelectedWorksProps = {
  works: YosakoiWork[];
};

export function SelectedWorks({ works }: SelectedWorksProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobilePlayback, setIsMobilePlayback] = useState(false);
  const activeWork = works.find((work) => work.id === activeId);

  function closeMobilePlayback(workId: string) {
    setActiveId(null);
    window.requestAnimationFrame(() => {
      document.getElementById(`selected-trigger-${workId}`)?.focus();
    });
  }

  useEffect(() => {
    const media = window.matchMedia("(max-width: 639px)");
    const updateMode = () => setIsMobilePlayback(media.matches);
    const handleChange = () => {
      updateMode();
      setActiveId(null);
    };

    updateMode();
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <div className="selected-grid">
        {works.map((work) => {
          const isActive = activeId === work.id;
          const mobilePlayerId = `selected-mobile-player-${work.id}`;

          return (
            <article className="selected-work" key={work.id}>
              {isMobilePlayback && isActive && work.youtubeId ? (
                <div className="selected-work__mobile-active">
                  <div
                    className="selected-work__mobile-player work-card__player"
                    id={mobilePlayerId}
                  >
                    <iframe
                      src={getYoutubeEmbedUrl(work.youtubeId, true)}
                      title={`${work.teamName}「${work.workTitle ?? "演舞楽曲"}」を再生`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      className="work-card__close"
                      type="button"
                      onClick={() => closeMobilePlayback(work.id)}
                      aria-label={`${work.teamName}「${work.workTitle ?? "演舞楽曲"}」の再生を閉じる`}
                      autoFocus
                    >
                      <span aria-hidden="true">×</span>
                      閉じる
                    </button>
                  </div>
                  <span className="selected-work__caption">
                    <span>
                      <small>{formatYears(work.years)}</small>
                      <strong>{work.workTitle ?? "演舞楽曲"}</strong>
                    </span>
                    <span className="selected-work__play" aria-hidden="true">
                      再生中
                    </span>
                  </span>
                </div>
              ) : (
                <button
                  className="selected-work__button"
                  id={`selected-trigger-${work.id}`}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={
                    isMobilePlayback ? mobilePlayerId : "selected-player"
                  }
                  onClick={() => setActiveId(isActive ? null : work.id)}
                >
                  <YosakoiThumbnail
                    work={work}
                    showYoutubeLabel={false}
                    priority={works.indexOf(work) < 2}
                  />
                  <span className="selected-work__caption">
                    <span>
                      <small>{formatYears(work.years)}</small>
                      <strong>{work.workTitle ?? "演舞楽曲"}</strong>
                    </span>
                    <span className="selected-work__play" aria-hidden="true">
                      {isActive ? "閉じる" : "再生"}
                    </span>
                  </span>
                </button>
              )}
            </article>
          );
        })}
      </div>

      <div
        className="selected-player"
        id="selected-player"
        aria-live="polite"
      >
        {!isMobilePlayback && activeWork?.youtubeId ? (
          <div className="selected-player__inner">
            <div className="selected-player__video">
              <iframe
                src={getYoutubeEmbedUrl(activeWork.youtubeId)}
                title={`${activeWork.teamName}「${activeWork.workTitle ?? "演舞楽曲"}」`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="selected-player__copy">
              <p className="section-label">NOW PLAYING</p>
              <h3>{activeWork.teamName}</h3>
              <p>「{activeWork.workTitle}」</p>
              <a
                className="text-link"
                href={getYoutubeUrl(activeWork.youtubeId)}
                target="_blank"
                rel="noreferrer"
              >
                YouTubeで開く ↗
              </a>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
