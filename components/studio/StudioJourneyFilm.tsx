"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { LoopVideo } from "@/components/v2/LoopVideo";
import { usePlayer } from "@/components/v2/PlayerProvider";
import type { StageWork } from "@/lib/year-archive";

function subscribeVisibility(change: () => void) {
  document.addEventListener("visibilitychange", change);
  return () => document.removeEventListener("visibilitychange", change);
}
function subscribeMotion(change: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", change);
  return () => media.removeEventListener("change", change);
}

export function StudioJourneyFilm({ film, queueIds }: { film: StageWork; queueIds: string[] }) {
  const { activeId, open } = usePlayer();
  const mediaRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [loopChoice, setLoopChoice] = useState<boolean | null>(null);
  const visible = useSyncExternalStore(subscribeVisibility, () => !document.hidden, () => false);
  const reduced = useSyncExternalStore(subscribeMotion, () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, () => true);
  const enabled = loopChoice ?? !reduced;

  useEffect(() => {
    const element = mediaRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: .05 });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return <div className="studio-journey__film" ref={mediaRef}>
    <Image src={`https://i.ytimg.com/vi/${film.youtubeId}/maxresdefault.jpg`} alt={`國士舞双「${film.workTitle}」の演舞映像（静止画）`} width={1280} height={720} sizes="100vw" unoptimized />
    {film.youtubeId && enabled && inView && visible && activeId === null ? <LoopVideo youtubeId={film.youtubeId} /> : null}
    <div className="studio-journey__film-actions">
      <button type="button" aria-haspopup="dialog" aria-label={`國士舞双「${film.workTitle}」を音声つきで観る`} onClick={(event) => open(film.id, event.currentTarget, queueIds)}><span aria-hidden="true">▶</span> 音声つきで観る</button>
      <button type="button" aria-pressed={!enabled} onClick={() => setLoopChoice(!enabled)}><span aria-hidden="true">{enabled ? "Ⅱ" : "▶"}</span> {enabled ? "映像を止める" : "映像を動かす"}</button>
    </div>
  </div>;
}
