"use client";

import { useEffect, useId, useRef, useState } from "react";
import { announcePlayback, useExclusivePlayback } from "@/lib/playback";
import { getYoutubeEmbedUrl, getYoutubeUrl } from "@/lib/yosakoi";

type HotaeruFilmProps = {
  youtubeId: string;
  title: string;
  caption: string;
};

function getPreviewUrl(youtubeId: string) {
  return (
    `https://www.youtube-nocookie.com/embed/${youtubeId}` +
    `?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${youtubeId}` +
    "&modestbranding=1&rel=0&disablekb=1"
  );
}

/**
 * A muted, silent preview loop (only while near the viewport and when motion
 * is allowed). Sound only starts when the user presses play, which swaps the
 * preview for a regular player. Closing removes the player so no audio remains.
 */
export function HotaeruFilm({ youtubeId, title, caption }: HotaeruFilmProps) {
  const sourceId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [isPreviewLoaded, setIsPreviewLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(true);

  useExclusivePlayback(sourceId, () => setIsPlaying(false));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNear(entry.isIntersecting);
        if (!entry.isIntersecting) setIsPreviewLoaded(false);
      },
      { rootMargin: "240px 0px", threshold: 0.01 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  const showPreview = isNear && !reduceMotion && !isPlaying;

  return (
    <div
      className="hotaeru-film"
      ref={rootRef}
      data-playing={isPlaying ? "true" : "false"}
    >
      <div className="hotaeru-film__media">
        <div
          className="hotaeru-film__poster"
          aria-hidden="true"
          style={{
            backgroundImage: `url("https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg")`,
          }}
        />
        {showPreview ? (
          <iframe
            className={`hotaeru-film__preview${isPreviewLoaded ? " is-loaded" : ""}`}
            src={getPreviewUrl(youtubeId)}
            title={`${title}（音声なしのプレビュー）`}
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => setIsPreviewLoaded(true)}
          />
        ) : null}
        {isPlaying ? (
          <iframe
            className="hotaeru-film__player"
            src={getYoutubeEmbedUrl(youtubeId, true)}
            title={`${title}を再生`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <div className="hotaeru-film__overlay" aria-hidden="true" />
        )}
      </div>

      {isPlaying ? (
        <button
          className="hotaeru-film__close"
          type="button"
          onClick={() => {
            setIsPlaying(false);
            window.requestAnimationFrame(() => playButtonRef.current?.focus());
          }}
          aria-label={`${title}の再生を閉じる`}
          autoFocus
        >
          <span aria-hidden="true">×</span>
          閉じる
        </button>
      ) : (
        <div className="hotaeru-film__content">
          <p className="hotaeru-film__label">映像</p>
          <h3 className="hotaeru-film__title">{title}</h3>
          <p className="hotaeru-film__caption">{caption}</p>
          <div className="hotaeru-film__actions">
            <button
              ref={playButtonRef}
              className="hotaeru-film__play"
              type="button"
              onClick={() => {
                setIsPlaying(true);
                announcePlayback(sourceId);
              }}
            >
              <span className="hotaeru-film__play-mark" aria-hidden="true" />
              音声つきで再生する
            </button>
            <a
              className="hotaeru-film__external"
              href={getYoutubeUrl(youtubeId)}
              target="_blank"
              rel="noreferrer"
            >
              YouTubeで見る ↗
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
