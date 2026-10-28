"use client";

import { useEffect, useRef, useState } from "react";
import { loadYouTubeIframeApi, type YouTubePlayer } from "@/lib/youtube-iframe-api";

/**
 * Muted background loop. It stays transparent until YouTube reports that it
 * is actually playing, so blocked autoplay or an unavailable embed leaves the
 * real still from the film on screen instead of an error panel.
 */
export function LoopVideo({ youtubeId }: { youtubeId: string }) {
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

