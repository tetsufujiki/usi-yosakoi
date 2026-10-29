"use client";

import { useEffect, useRef } from "react";

import { TeamMark } from "@/components/TeamMark";
import { usePlayer } from "@/components/v2/PlayerProvider";
import { getPlayLabel, getWorkTitle, type StageWork } from "@/lib/year-archive";

export function SoundCard({ work, queueIds, compact = false }: { work: StageWork; queueIds: string[]; compact?: boolean }) {
  const { activeId, open } = usePlayer();
  const titleRef = useRef<HTMLSpanElement>(null);
  const title = getWorkTitle(work);
  useEffect(() => {
    const element = titleRef.current;
    if (!element) return;
    let lastWidth = -1;
    const measure = () => {
      delete element.dataset.multiline;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      if (element.getBoundingClientRect().height > lineHeight * 1.5) element.dataset.multiline = "true";
    };
    const observer = new ResizeObserver(([entry]) => {
      if (Math.abs(entry.contentRect.width - lastWidth) < 0.5) return;
      lastWidth = entry.contentRect.width;
      measure();
    });
    observer.observe(element);
    let disposed = false;
    void document.fonts.ready.then(() => { if (!disposed) measure(); });
    return () => { disposed = true; observer.disconnect(); };
  }, [title, compact]);
  if (compact) return (
    <button className="studio-track" type="button"
      onClick={(event) => open(work.id, event.currentTarget, queueIds)}
      disabled={!work.youtubeId} aria-label={getPlayLabel(work)} aria-haspopup="dialog"
      data-active={activeId === work.id || undefined}>
      <span className="studio-track__year">{work.yearLabel}</span>
      <span ref={titleRef} className="studio-track__title">{title}</span>
      <span className="studio-track__play" aria-hidden="true">{work.youtubeId ? "▶" : "—"}</span>
    </button>
  );
  return (
    <button className="studio-work" type="button"
      onClick={(event) => open(work.id, event.currentTarget, queueIds)}
      disabled={!work.youtubeId} aria-label={getPlayLabel(work)} aria-haspopup="dialog"
      data-active={activeId === work.id || undefined}>
      <span className="studio-work__art">
        {work.mark ? <TeamMark mark={work.mark} size={300} /> : <span className="studio-work__nameplate">{work.teamName}</span>}
        <span className="studio-work__listen" aria-hidden="true">{work.youtubeId ? "▶ 聴く" : "映像なし"}</span>
      </span>
      <span className="studio-work__caption">
        <span className="studio-work__year">{work.yearLabel}<span aria-hidden="true"> ↗</span></span>
        <span className="studio-work__team">{work.teamName}</span>
        <span ref={titleRef} className="studio-work__title">{title}</span>
      </span>
    </button>
  );
}
