"use client";

import { useCallback, useEffect, useId, useRef, type CSSProperties, type PointerEvent } from "react";
import type { TeamMarkAsset } from "@/lib/team-marks";

export type RailOption = {
  id: string;
  label: string;
  shortLabel?: string;
  count: number;
  mark?: TeamMarkAsset;
};

export function FilterRail({ label, kind, options, value, onChange }: {
  label: string;
  kind: "year" | "team";
  options: RailOption[];
  value: string;
  onChange: (value: string) => void;
}) {
  const groupId = useId();
  const railRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  const changeRef = useRef(onChange);
  const interactedRef = useRef(false);
  const dragRef = useRef({ pointer: -1, x: 0, scroll: 0, moving: false, suppressUntil: 0 });
  const settleRef = useRef<() => void>(() => {});
  const keys = options.map((option) => option.id).join("|");

  useEffect(() => { valueRef.current = value; changeRef.current = onChange; }, [value, onChange]);

  const center = useCallback((id: string, smooth: boolean) => {
    const rail = railRef.current;
    const item = rail?.querySelector<HTMLButtonElement>(`[data-option-id="${CSS.escape(id)}"]`);
    if (!rail || !item) return;
    rail.scrollTo({
      left: item.offsetLeft - (rail.clientWidth - item.offsetWidth) / 2,
      behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant",
    });
  }, []);

  useEffect(() => { center(value, true); }, [value, center]);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;
    let timer: ReturnType<typeof setTimeout>;
    let frame = 0;
    const buttons = Array.from(rail.querySelectorAll<HTMLButtonElement>("[data-option-id]"));

    function nearest() {
      const middle = rail!.scrollLeft + rail!.clientWidth / 2;
      return buttons.reduce((best, item) =>
        Math.abs(item.offsetLeft + item.offsetWidth / 2 - middle) < Math.abs(best.offsetLeft + best.offsetWidth / 2 - middle) ? item : best,
      buttons[0]);
    }

    function paint() {
      frame = 0;
      const middle = rail!.scrollLeft + rail!.clientWidth / 2;
      buttons.forEach((item) => {
        const distance = (item.offsetLeft + item.offsetWidth / 2 - middle) / (item.offsetWidth + 16);
        const amount = Math.min(Math.abs(distance), 3);
        item.style.setProperty("--rail-turn", `${Math.max(-30, Math.min(30, -distance * 13))}deg`);
        item.style.setProperty("--rail-scale", `${1 - amount * .055}`);
        item.style.setProperty("--rail-drop", `${amount * 4}px`);
      });
    }

    function commit() {
      if (dragRef.current.moving || !interactedRef.current) return;
      const id = nearest()?.dataset.optionId;
      interactedRef.current = false;
      if (id && id !== valueRef.current) changeRef.current(id);
    }

    function settle() {
      clearTimeout(timer);
      timer = setTimeout(commit, 180);
    }

    function scroll() {
      if (!frame) frame = requestAnimationFrame(paint);
      settle();
    }

    const observer = new ResizeObserver(() => {
      interactedRef.current = false;
      center(valueRef.current, false);
      paint();
    });
    observer.observe(rail);
    rail.addEventListener("scroll", scroll, { passive: true });
    settleRef.current = settle;
    center(valueRef.current, false);
    paint();
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      rail.removeEventListener("scroll", scroll);
      settleRef.current = () => {};
    };
  }, [center, keys]);

  function select(id: string) {
    interactedRef.current = false;
    onChange(id);
    center(id, true);
  }

  function move(direction: number) {
    const index = options.findIndex((option) => option.id === value);
    const next = options[Math.max(0, Math.min(options.length - 1, index + direction))];
    select(next.id);
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    interactedRef.current = true;
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    dragRef.current = { pointer: event.pointerId, x: event.clientX, scroll: event.currentTarget.scrollLeft, moving: false, suppressUntil: 0 };
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (event.pointerType !== "mouse" || drag.pointer !== event.pointerId) return;
    const distance = event.clientX - drag.x;
    if (!drag.moving && Math.abs(distance) > 5) {
      drag.moving = true;
      event.currentTarget.dataset.dragging = "true";
      event.currentTarget.setPointerCapture(event.pointerId);
    }
    if (drag.moving) {
      event.preventDefault();
      event.currentTarget.scrollLeft = drag.scroll - distance;
    }
  }

  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (drag.pointer !== event.pointerId) return;
    if (drag.moving) drag.suppressUntil = performance.now() + 350;
    drag.moving = false;
    drag.pointer = -1;
    delete event.currentTarget.dataset.dragging;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    settleRef.current();
  }

  return (
    <div className={`filter-row filter-row--${kind}`}>
      <span id={groupId} className="filter-row__accessible-label">{label}</span>
      <div className="filter-row__body">
        <div ref={railRef} className={`filter-rail filter-rail--${kind}`} role="radiogroup" aria-labelledby={groupId}
          onWheel={() => { interactedRef.current = true; }}
          onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
          onClickCapture={(event) => {
            if (performance.now() < dragRef.current.suppressUntil) { event.preventDefault(); event.stopPropagation(); }
          }}>
          {options.map((option, index) => <button key={option.id} type="button" role="radio"
            className="filter-rail__item" data-option-id={option.id}
            aria-checked={value === option.id} aria-label={`${option.label}、${option.count}作品`}
            tabIndex={value === option.id ? 0 : -1} title={option.label}
            style={{ "--rail-turn": "0deg", "--rail-scale": "1", "--rail-drop": "0px" } as CSSProperties}
            onClick={() => select(option.id)}
            onKeyDown={(event) => {
              let nextIndex = index;
              if (event.key === "ArrowRight") nextIndex = Math.min(options.length - 1, index + 1);
              else if (event.key === "ArrowLeft") nextIndex = Math.max(0, index - 1);
              else if (event.key === "Home") nextIndex = 0;
              else if (event.key === "End") nextIndex = options.length - 1;
              else return;
              event.preventDefault();
              const next = options[nextIndex];
              select(next.id);
              railRef.current?.querySelector<HTMLButtonElement>(`[data-option-id="${CSS.escape(next.id)}"]`)?.focus({ preventScroll: true });
            }}>
            {kind === "year" ? <span className={`filter-rail__year ${option.id === "all" ? "is-all" : ""}`}>{option.label}</span>
              : <span className="filter-rail__team-text">{option.shortLabel ?? option.label}</span>}
            <span className="filter-rail__count">{option.count}<span>作品</span></span>
          </button>)}
        </div>
        <div className="filter-row__arrows">
          <button type="button" aria-label={`${label}を前へ`} onClick={() => move(-1)}>←</button>
          <button type="button" aria-label={`${label}を次へ`} onClick={() => move(1)}>→</button>
        </div>
      </div>
    </div>
  );
}
