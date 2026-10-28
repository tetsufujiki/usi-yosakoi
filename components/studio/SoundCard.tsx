"use client";

import { TeamMark } from "@/components/TeamMark";
import { usePlayer } from "@/components/v2/PlayerProvider";
import { getPlayLabel, getWorkTitle, type StageWork } from "@/lib/year-archive";

export function SoundCard({ work, queueIds, compact = false }: { work: StageWork; queueIds: string[]; compact?: boolean }) {
  const { activeId, open } = usePlayer();
  if (compact) return (
    <button className="studio-track" type="button"
      onClick={(event) => open(work.id, event.currentTarget, queueIds)}
      disabled={!work.youtubeId} aria-label={getPlayLabel(work)} aria-haspopup="dialog"
      data-active={activeId === work.id || undefined}>
      <span className="studio-track__year">{work.yearLabel}</span>
      <span className="studio-track__title">{getWorkTitle(work)}</span>
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
        <span className="studio-work__title">{getWorkTitle(work)}</span>
      </span>
    </button>
  );
}
