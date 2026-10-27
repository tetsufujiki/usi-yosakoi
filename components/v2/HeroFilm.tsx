"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { TeamMark } from "@/components/TeamMark";
import { usePlayer } from "@/components/v2/PlayerProvider";
import { getWorkTitle, type StageWork } from "@/lib/year-archive";
import {
  loadYouTubeIframeApi,
  type YouTubePlayer,
} from "@/lib/youtube-iframe-api";

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const media = window.matchMedia(reducedMotionQuery);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Muted background loop. It stays transparent until YouTube reports that it
 * is actually playing, so blocked autoplay or an unavailable embed leaves the
 * real still from the film on screen instead of an error panel.
 */
function LoopVideo({ youtubeId }: { youtubeId: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let player: YouTubePlayer | undefined;
    let isCancelled = false;
    const target = document.createElement("div");
    host.append(target);

    loadYouTubeIframeApi()
      .then((YT) => {
        if (isCancelled) return;
        player = new YT.Player(target, {
          host: "https://www.youtube-nocookie.com",
          videoId: youtubeId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: youtubeId,
            playsinline: 1,
            rel: 0,
            disablekb: 1,
            iv_load_policy: 3,
          },
          events: {
            onReady: (event) => {
              event.target.getIframe().setAttribute("tabindex", "-1");
              event.target.mute();
              event.target.playVideo();
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) setHasStarted(true);
            },
            onError: () => setHasStarted(false),
          },
        });
      })
      .catch(() => setHasStarted(false));

    return () => {
      isCancelled = true;
      player?.destroy();
      host.replaceChildren();
    };
  }, [youtubeId]);

  return (
    <div
      ref={hostRef}
      className={`v2-film__loop${hasStarted ? " is-ready" : ""}`}
      aria-hidden="true"
    />
  );
}

type HeroFilmProps = {
  work: StageWork & { youtubeId: string };
  archiveRange: string;
};

/**
 * The muted loop is decoration over a real still from the film. Sound only
 * starts in the shared player, and the loop is removed while that player is
 * open or the hero is off screen, so two videos never run at once.
 */
export function HeroFilm({ work, archiveRange }: HeroFilmProps) {
  const { activeId, open } = usePlayer();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(true);
  const [loopChoice, setLoopChoice] = useState<boolean | null>(null);
  const prefersReducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(media);
    return () => observer.disconnect();
  }, []);

  const isLoopEnabled = loopChoice ?? !prefersReducedMotion;
  const showLoop = isLoopEnabled && isInView && activeId === null;
  const title = getWorkTitle(work);

  return (
    <section className="v2-film" aria-labelledby="film-title">
      <div className="v2-film__media" ref={mediaRef}>
        <Image
          className="v2-film__poster"
          src={`https://i.ytimg.com/vi/${work.youtubeId}/maxresdefault.jpg`}
          alt={`${work.teamName}「${title}」の演舞（映像の静止画）`}
          fill
          priority
          sizes="100vw"
        />
        {showLoop ? <LoopVideo youtubeId={work.youtubeId} /> : null}
      </div>

      <div className="v2-film__panel">
        <h1 id="film-title" className="v2-film__kicker">
          よさこい演舞楽曲 <span aria-hidden="true">/</span> UNITED STUDIO INC
        </h1>
        <div className="v2-film__work">
          {work.mark ? (
            <TeamMark
              mark={work.mark}
              tone="white"
              size={96}
              className="v2-film__mark"
              priority
            />
          ) : null}
          <div className="v2-film__work-text">
            <p className="v2-film__meta">
              <span className="v2-film__year">{work.yearLabel}</span>
              {work.teamName}
            </p>
            <p className="v2-film__title">{title}</p>
          </div>
        </div>
        <div className="v2-film__actions">
          <button
            className="v2-button v2-button--red"
            type="button"
            aria-haspopup="dialog"
            onClick={(event) => open(work.id, event.currentTarget)}
          >
            <span className="v2-button__play" aria-hidden="true" />
            音声つきで観る
          </button>
          <button
            className="v2-button v2-button--ghost"
            type="button"
            onClick={() => setLoopChoice(!isLoopEnabled)}
          >
            {isLoopEnabled ? "背景映像を止める" : "背景映像を流す"}
          </button>
        </div>
      </div>

      <a className="v2-film__next" href="#archive">
        作品アーカイブ {archiveRange}
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
