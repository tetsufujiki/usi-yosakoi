"use client";

import {
  createContext,
  use,
  useCallback,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { FloatingPlayer } from "@/components/v2/FloatingPlayer";
import { announcePlayback } from "@/lib/playback";
import type { StageWork } from "@/lib/year-archive";

type PlayerContextValue = {
  activeId: string | null;
  open: (workId: string, trigger?: HTMLElement | null, queueIds?: string[]) => void;
};

const PlayerContext = createContext<PlayerContextValue | null>(null);

const playerSourceId = "usi-floating-player";

export function usePlayer() {
  const context = use(PlayerContext);
  if (!context) throw new Error("usePlayer must be used inside PlayerProvider.");
  return context;
}

type PlayerProviderProps = {
  /** Every playable work in archive order; drives previous/next. */
  works: StageWork[];
  children: ReactNode;
};

/**
 * One player for the whole page. Cards only open it; the YouTube iframe is
 * created for the selected work alone and removed on close.
 */
export function PlayerProvider({ works, children }: PlayerProviderProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [queueIds, setQueueIds] = useState<string[] | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const queue = useMemo(() => {
    if (!queueIds) return works.filter((work) => work.youtubeId);
    const byId = new Map(works.map((work) => [work.id, work]));
    return queueIds.flatMap((id) => {
      const work = byId.get(id);
      return work?.youtubeId ? [work] : [];
    });
  }, [works, queueIds]);
  const activeIndex = queue.findIndex((work) => work.id === activeId);
  const activeWork = activeIndex >= 0 ? queue[activeIndex] : null;

  const open = useCallback(
    (workId: string, trigger?: HTMLElement | null, ids?: string[]) => {
      triggerRef.current =
        trigger ?? (document.activeElement as HTMLElement | null);
      setActiveId(workId);
      setQueueIds(ids ?? null);
      announcePlayback(playerSourceId);
    },
    [],
  );

  const close = useCallback(() => {
    setActiveId(null);
    const trigger = triggerRef.current;
    window.requestAnimationFrame(() => trigger?.focus({ preventScroll: true }));
  }, []);

  const step = useCallback(
    (direction: -1 | 1) => {
      if (activeIndex < 0) return;
      const nextIndex = (activeIndex + direction + queue.length) % queue.length;
      setActiveId(queue[nextIndex].id);
    },
    [activeIndex, queue],
  );

  const value = useMemo(() => ({ activeId, open }), [activeId, open]);

  return (
    <PlayerContext value={value}>
      {children}
      <FloatingPlayer
        work={activeWork}
        position={activeIndex + 1}
        total={queue.length}
        onClose={close}
        onStep={step}
      />
    </PlayerContext>
  );
}
