"use client";

import { useState } from "react";
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
  const activeWork = works.find((work) => work.id === activeId);

  return (
    <>
      <div className="selected-grid">
        {works.map((work) => {
          const isActive = activeId === work.id;

          return (
            <article className="selected-work" key={work.id}>
              <button
                className="selected-work__button"
                type="button"
                aria-pressed={isActive}
                aria-controls="selected-player"
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
            </article>
          );
        })}
      </div>

      <div
        className="selected-player"
        id="selected-player"
        aria-live="polite"
      >
        {activeWork?.youtubeId ? (
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
