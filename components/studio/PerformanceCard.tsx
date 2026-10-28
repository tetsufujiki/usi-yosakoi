"use client";

import Image from "next/image";
import { useState } from "react";
import { usePlayer } from "@/components/v2/PlayerProvider";
import { getPlayLabel, getWorkTitle, type StageWork } from "@/lib/year-archive";

export function PerformanceCard({ work, queueIds }: { work: StageWork; queueIds: string[] }) {
  const { activeId, open } = usePlayer();
  const [thumbnail, setThumbnail] = useState("maxresdefault");
  return <button className="performance-card" type="button" disabled={!work.youtubeId}
    aria-label={getPlayLabel(work)} aria-haspopup="dialog" data-active={activeId === work.id || undefined}
    onClick={(event) => open(work.id, event.currentTarget, queueIds)}>
    <span className="performance-card__screen">
      <Image src={`https://i.ytimg.com/vi/${work.youtubeId}/${thumbnail}.jpg`} alt={`${work.teamName}「${getWorkTitle(work)}」の演舞映像`} width={640} height={360} sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw" unoptimized onError={() => { if (thumbnail !== "hqdefault") setThumbnail("hqdefault"); }} />
      <span className="performance-card__play" aria-hidden="true">▶</span>
      <span className="performance-card__label">音声つきで再生</span>
    </span>
    <span className="performance-card__caption"><span className="performance-card__year">{work.yearLabel}</span><span className="performance-card__title">{getWorkTitle(work)}</span></span>
  </button>;
}
