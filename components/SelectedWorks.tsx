"use client";

import { useEffect, useId, useState } from "react";
import type { PresentedWork } from "@/lib/archive";
import { announcePlayback, useExclusivePlayback } from "@/lib/playback";
import {
  formatYears,
  getYoutubeEmbedUrl,
  getYoutubeUrl,
} from "@/lib/yosakoi";
import { YosakoiThumbnail } from "./YosakoiThumbnail";

type SelectedWorksProps = {
  works: PresentedWork[];
  /** Show the team name in each caption (for mixed-team selections). */
  showTeam?: boolean;
  className?: string;
};

export function SelectedWorks({
  works,
  showTeam = false,
  className,
}: SelectedWorksProps) {
  const instanceId = useId();
  const playerId = `selected-player-${instanceId}`;
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isMobilePlayback, setIsMobilePlayback] = useState(false);
  const activeWork = works.find((work) => work.id === activeId);

  useExclusivePlayback(instanceId, () => setActiveId(null));

  function selectWork(workId: string | null) {
    setActiveId(workId);
    if (workId) announcePlayback(instanceId);
  }

  function closeMobilePlayback(workId: string) {
    setActiveId(null);
    window.requestAnimationFrame(() => {
      document.getElementById(`selected-trigger-${instanceId}-${workId}`)?.focus();
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
    <div className={className}>
      <div className="selected-grid">
        {works.map((work, index) => {
          const isActive = activeId === work.id;
          const mobilePlayerId = `selected-mobile-player-${instanceId}-${work.id}`;
          const title = work.workTitle ?? "演舞楽曲";
          const caption = (
            <span>
              <small>
                {formatYears(work.years)}
                {showTeam ? (
                  <span className="selected-work__team">{work.teamLabel}</span>
                ) : null}
              </small>
              <strong>{title}</strong>
            </span>
          );

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
                      title={`${work.teamLabel}「${title}」を再生`}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                    <button
                      className="work-card__close"
                      type="button"
                      onClick={() => closeMobilePlayback(work.id)}
                      aria-label={`${work.teamLabel}「${title}」の再生を閉じる`}
                      autoFocus
                    >
                      <span aria-hidden="true">×</span>
                      閉じる
                    </button>
                  </div>
                  <span className="selected-work__caption">
                    {caption}
                    <span className="selected-work__play" aria-hidden="true">
                      再生中
                    </span>
                  </span>
                </div>
              ) : (
                <button
                  className="selected-work__button"
                  id={`selected-trigger-${instanceId}-${work.id}`}
                  type="button"
                  aria-pressed={isActive}
                  aria-controls={isMobilePlayback ? mobilePlayerId : playerId}
                  aria-label={`${work.teamLabel}「${title}」${formatYears(work.years)}年を${isActive ? "閉じる" : "再生する"}`}
                  onClick={() => selectWork(isActive ? null : work.id)}
                >
                  <YosakoiThumbnail
                    work={work}
                    teamLabel={work.teamLabel}
                    mark={work.mark}
                    showYoutubeLabel={false}
                    priority={index < 2}
                  />
                  <span className="selected-work__caption">
                    {caption}
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

      <div className="selected-player" id={playerId} aria-live="polite">
        {!isMobilePlayback && activeWork?.youtubeId ? (
          <div className="selected-player__inner">
            <div className="selected-player__video">
              <iframe
                src={getYoutubeEmbedUrl(activeWork.youtubeId, true)}
                title={`${activeWork.teamLabel}「${activeWork.workTitle ?? "演舞楽曲"}」`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="selected-player__copy">
              <p className="section-label">再生中</p>
              <h3>{activeWork.teamLabel}</h3>
              <p>
                {formatYears(activeWork.years)}「{activeWork.workTitle ?? "演舞楽曲"}」
              </p>
              <div className="selected-player__actions">
                <a
                  className="text-link"
                  href={getYoutubeUrl(activeWork.youtubeId)}
                  target="_blank"
                  rel="noreferrer"
                >
                  YouTubeで開く ↗
                </a>
                <button
                  className="text-link"
                  type="button"
                  onClick={() => {
                    const closingId = activeWork.id;
                    setActiveId(null);
                    window.requestAnimationFrame(() => {
                      document
                        .getElementById(`selected-trigger-${instanceId}-${closingId}`)
                        ?.focus();
                    });
                  }}
                >
                  再生を閉じる
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
