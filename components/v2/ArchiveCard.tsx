"use client";

import type { CSSProperties } from "react";
import { TeamMark } from "@/components/TeamMark";
import { usePlayer } from "@/components/v2/PlayerProvider";
import {
  getPlayLabel,
  getWorkTitle,
  type Nameplate,
  type StageWork,
} from "@/lib/year-archive";

function TeamNameplate({ nameplate }: { nameplate: Nameplate }) {
  return (
    <span
      className="v2-card__nameplate"
      style={{ "--plate-size": `${nameplate.size}cqi` } as CSSProperties}
    >
      <span className="v2-card__nameplate-ja">
        {nameplate.lines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </span>
      {nameplate.latin ? (
        <span className="v2-card__nameplate-latin">{nameplate.latin}</span>
      ) : null}
    </span>
  );
}

export function ArchiveCard({ work }: { work: StageWork }) {
  const { activeId, open } = usePlayer();
  const isActive = activeId === work.id;
  const title = getWorkTitle(work);

  const face = (
    <span className="v2-card__face">
      {work.mark ? (
        <TeamMark mark={work.mark} size={240} className="v2-card__mark" />
      ) : work.nameplate ? (
        <TeamNameplate nameplate={work.nameplate} />
      ) : null}
    </span>
  );

  const meta = (
    <span className="v2-card__meta">
      <span className="v2-card__row">
        <span className="v2-card__year">{work.yearLabel}</span>
        {work.youtubeId ? (
          <span className="v2-card__play">
            <span className="v2-card__play-icon" aria-hidden="true" />
            {isActive ? "再生中" : "再生"}
          </span>
        ) : (
          <span className="v2-card__play">映像なし</span>
        )}
      </span>
      <span className="v2-card__team">{work.teamName}</span>
      <span className="v2-card__title">{title}</span>
    </span>
  );

  if (!work.youtubeId) {
    return (
      <div className="v2-card is-unavailable">
        {face}
        {meta}
      </div>
    );
  }

  return (
    <button
      className="v2-card"
      type="button"
      data-active={isActive ? "true" : undefined}
      aria-haspopup="dialog"
      aria-label={getPlayLabel(work)}
      onClick={(event) => open(work.id, event.currentTarget)}
    >
      {face}
      {meta}
    </button>
  );
}
