"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";

const videoId = "RQyDJsJmaIg";
const embedUrl =
  `https://www.youtube-nocookie.com/embed/${videoId}` +
  `?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${videoId}` +
  "&modestbranding=1&rel=0&disablekb=1&enablejsapi=1";

type JourneyVideoBackgroundProps = {
  children: ReactNode;
};

export function JourneyVideoBackground({ children }: JourneyVideoBackgroundProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isNear, setIsNear] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(true);

  const sendPlayerCommand = (command: "mute" | "unMute") => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: "command", func: command, args: [] }),
      "https://www.youtube-nocookie.com",
    );
  };

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(media.matches);

    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const root = rootRef.current;

    if (!root || reduceMotion) {
      setIsNear(false);
      setIsLoaded(false);
      setIsMuted(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsNear(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsLoaded(false);
          setIsMuted(true);
        }
      },
      { rootMargin: "320px 0px", threshold: 0.01 },
    );

    observer.observe(root);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div className="journey-video" ref={rootRef}>
      <div className="journey-video__media">
        <div className="journey-video__poster" aria-hidden="true" />
        {isNear ? (
          <iframe
            ref={iframeRef}
            className={`journey-video__iframe${isLoaded ? " is-loaded" : ""}`}
            src={embedUrl}
            title="國士舞双の演舞映像（背景動画）"
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            tabIndex={-1}
            aria-hidden="true"
            onLoad={() => {
              sendPlayerCommand("mute");
              setIsMuted(true);
              setIsLoaded(true);
            }}
          />
        ) : null}
        <div className="journey-video__overlay" aria-hidden="true" />
      </div>
      <div className="journey-video__content">{children}</div>
      {isNear && isLoaded ? (
        <button
          className="journey-video__audio"
          type="button"
          aria-label={isMuted ? "背景動画の音声をオンにする" : "背景動画の音声をオフにする"}
          aria-pressed={!isMuted}
          onClick={() => {
            const nextMuted = !isMuted;
            sendPlayerCommand(nextMuted ? "mute" : "unMute");
            setIsMuted(nextMuted);
          }}
        >
          <span aria-hidden="true" className="journey-video__audio-mark">
            {isMuted ? "×" : "♪"}
          </span>
          音声 {isMuted ? "OFF" : "ON"}
        </button>
      ) : null}
    </div>
  );
}
