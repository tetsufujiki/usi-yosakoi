"use client";

import {
  useEffect,
  useId,
  useRef,
  type KeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from "react";
import { TeamMark } from "@/components/TeamMark";
import { getWorkTitle, type StageWork } from "@/lib/year-archive";
import { getYoutubeEmbedUrl, getYoutubeUrl } from "@/lib/yosakoi";

type FloatingPlayerProps = {
  work: StageWork | null;
  position: number;
  total: number;
  onClose: () => void;
  onStep: (direction: -1 | 1) => void;
};

export function FloatingPlayer({
  work,
  position,
  total,
  onClose,
  onStep,
}: FloatingPlayerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const isOpen = work !== null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen && !dialog.open) {
      dialog.showModal();
      closeRef.current?.focus();
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const root = document.documentElement;
    root.classList.add("is-player-open");
    return () => root.classList.remove("is-player-open");
  }, [isOpen]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    onClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "ArrowLeft") onStep(-1);
    if (event.key === "ArrowRight") onStep(1);
  }

  const title = work ? getWorkTitle(work) : "";

  return (
    <dialog
      ref={dialogRef}
      className="v2-player"
      aria-labelledby={titleId}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
    >
      {work?.youtubeId ? (
        <div className="v2-player__panel">
          <div className="v2-player__head">
            <div className="v2-player__identity">
              {work.mark ? (
                <TeamMark
                  mark={work.mark}
                  tone="white"
                  size={72}
                  className="v2-player__mark"
                />
              ) : null}
              <div className="v2-player__text" aria-live="polite">
                <p className="v2-player__status">
                  <span className="v2-player__chip">再生中</span>
                  <span className="v2-player__year">{work.yearLabel}</span>
                  <span className="v2-player__count">
                    {position} / {total}
                  </span>
                </p>
                <h2 id={titleId} className="v2-player__team">
                  {work.teamName}
                </h2>
                <p className="v2-player__title">{title}</p>
              </div>
            </div>
            <button
              ref={closeRef}
              className="v2-player__close"
              type="button"
              onClick={onClose}
            >
              <span className="v2-player__close-x" aria-hidden="true" />
              閉じる
            </button>
          </div>

          <div className="v2-player__screen">
            <iframe
              key={work.id}
              src={getYoutubeEmbedUrl(work.youtubeId, true)}
              title={`${work.teamName}「${title}」の演舞映像`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          <div className="v2-player__foot">
            <button
              className="v2-player__step"
              type="button"
              onClick={() => onStep(-1)}
            >
              <span aria-hidden="true">←</span>
              前の作品
            </button>
            <a
              className="v2-player__external"
              href={getYoutubeUrl(work.youtubeId)}
              target="_blank"
              rel="noreferrer"
            >
              YouTubeで見る <span aria-hidden="true">↗</span>
            </a>
            <button
              className="v2-player__step"
              type="button"
              onClick={() => onStep(1)}
            >
              次の作品
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
