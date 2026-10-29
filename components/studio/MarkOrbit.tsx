"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { TeamMark } from "@/components/TeamMark";
import { usePlayer } from "@/components/v2/PlayerProvider";
import { getPlayLabel, type StageWork } from "@/lib/year-archive";

type Motion = {
  angle: number;
  velocity: number;
  target: number | null;
  pointer: number | null;
  startX: number;
  startY: number;
  lastX: number;
  lastTime: number;
  dragging: boolean;
  vertical: boolean;
  hovering: boolean;
  focusing: boolean;
  suppressUntil: number;
};

const wrap = (value: number, length: number) => ((value % length) + length) % length;

/** One carousel, all supplied marks with published films. No per-frame React renders. */
export function MarkOrbit({ works }: { works: StageWork[] }) {
  const { activeId, open } = usePlayer();
  return <OrbitStage works={works} activeId={activeId} open={open} />;
}

/** A quiet, non-interactive version of the same ring for editorial backgrounds. */
export function MarkOrbitBackground({ works }: { works: StageWork[] }) {
  return <OrbitStage works={works} background activeId={null} />;
}

function OrbitStage({ works, background = false, activeId, open }: {
  works: StageWork[]; background?: boolean; activeId: string | null;
  open?: (id: string, trigger?: HTMLElement | null) => void;
}) {
  const [paused, setPaused] = useState(false);
  const [front, setFront] = useState(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLDivElement>(null);
  const wakeRef = useRef<() => void>(() => {});
  const drawRef = useRef<() => void>(() => {});
  const reducedRef = useRef(false);
  const motionRef = useRef<Motion>({
    angle: -180 / works.length, velocity: 0, target: null, pointer: null,
    startX: 0, startY: 0, lastX: 0, lastTime: 0,
    dragging: false, vertical: false, hovering: false, focusing: false, suppressUntil: 0,
  });
  const step = 360 / works.length;

  useEffect(() => {
    const viewport = viewportRef.current;
    const rotor = rotorRef.current;
    if (!viewport || !rotor) return;
    const motion = motionRef.current;
    const slots = Array.from(rotor.querySelectorAll<HTMLElement>(".mark-orbit__slot"));
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let inView = false;
    let frame = 0;
    let last = 0;
    let lastFront = -1;

    function draw() {
      rotor!.style.setProperty("--orbit-angle", `${motion.angle}deg`);
      // Hide the back of the ring explicitly: perspective can otherwise expose
      // thin blank backs between the foreground cards in WebKit.
      slots.forEach((slot, index) => {
        const facing = Math.cos((motion.angle + index * step) * Math.PI / 180);
        const visibility = facing > 0.12 ? "visible" : "hidden";
        if (slot.style.visibility !== visibility) slot.style.visibility = visibility;
      });
      const next = wrap(Math.round(-motion.angle / step), works.length);
      if (next !== lastFront) {
        lastFront = next;
        if (!background) setFront(next);
      }
    }

    function canRun() {
      return inView && !document.hidden && !reducedRef.current && activeId === null;
    }

    function tick(now: number) {
      frame = 0;
      if (!canRun()) return;
      const dt = last ? Math.min(now - last, 40) : 16;
      last = now;
      let moving = false;
      if (motion.target !== null) {
        const distance = motion.target - motion.angle;
        motion.angle += distance * (1 - Math.pow(0.87, dt / 16));
        if (Math.abs(distance) < 0.03) {
          motion.angle = motion.target;
          motion.target = null;
        }
        moving = true;
      } else if (!motion.dragging && Math.abs(motion.velocity) > 0.0005) {
        motion.angle += motion.velocity * dt;
        motion.velocity *= Math.pow(0.94, dt / 16);
        moving = true;
      } else if (!paused && !motion.dragging && !motion.hovering && !motion.focusing) {
        motion.angle += dt * (background ? 0.001 : -0.0025);
        moving = true;
      }
      draw();
      if (moving) frame = window.requestAnimationFrame(tick);
    }

    function wake() {
      if (!frame && canRun()) {
        last = 0;
        frame = window.requestAnimationFrame(tick);
      }
    }

    function stop() {
      window.cancelAnimationFrame(frame);
      frame = 0;
      last = 0;
    }

    function syncMotion() {
      reducedRef.current = media.matches;
      stop();
      if (media.matches) {
        motion.velocity = 0;
        if (motion.target !== null) {
          motion.angle = motion.target;
          motion.target = null;
        }
        draw();
      }
      wake();
    }

    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (inView) wake(); else stop();
    }, { threshold: 0.08 });
    observer.observe(viewport);
    wakeRef.current = wake;
    drawRef.current = draw;
    media.addEventListener("change", syncMotion);
    document.addEventListener("visibilitychange", syncMotion);
    syncMotion();
    draw();

    return () => {
      stop();
      observer.disconnect();
      media.removeEventListener("change", syncMotion);
      document.removeEventListener("visibilitychange", syncMotion);
      wakeRef.current = () => {};
      drawRef.current = () => {};
    };
  }, [activeId, background, paused, step, works.length]);

  function moveBy(direction: number) {
    const motion = motionRef.current;
    const index = Math.round(-(motion.target ?? motion.angle) / step) + direction;
    motion.velocity = 0;
    motion.target = -index * step;
    if (reducedRef.current) {
      motion.angle = motion.target;
      motion.target = null;
      drawRef.current();
    } else wakeRef.current();
  }

  function pointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || (event.pointerType === "mouse" && event.button !== 0)) return;
    const motion = motionRef.current;
    motion.pointer = event.pointerId;
    motion.startX = motion.lastX = event.clientX;
    motion.startY = event.clientY;
    motion.lastTime = event.timeStamp;
    motion.velocity = 0;
    motion.target = null;
    motion.dragging = false;
    motion.vertical = false;
  }

  function pointerMove(event: PointerEvent<HTMLDivElement>) {
    const motion = motionRef.current;
    if (motion.pointer !== event.pointerId || motion.vertical) return;
    const dx = event.clientX - motion.startX;
    const dy = event.clientY - motion.startY;
    if (!motion.dragging && Math.abs(dy) > 10 && Math.abs(dy) > Math.abs(dx)) {
      motion.vertical = true;
      return;
    }
    if (!motion.dragging && Math.abs(dx) > 6) {
      motion.dragging = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.dragging = "true";
    }
    if (!motion.dragging) return;
    const delta = event.clientX - motion.lastX;
    const dt = Math.max(8, event.timeStamp - motion.lastTime);
    const multiplier = event.pointerType === "touch" ? 0.09 : 0.06;
    motion.angle += delta * multiplier;
    motion.velocity = Math.max(-0.3, Math.min(0.3, delta * multiplier / dt));
    motion.lastX = event.clientX;
    motion.lastTime = event.timeStamp;
    drawRef.current();
  }

  function pointerEnd(event: PointerEvent<HTMLDivElement>) {
    const motion = motionRef.current;
    if (motion.pointer !== event.pointerId) return;
    if (motion.dragging) {
      motion.suppressUntil = performance.now() + 350;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
    }
    motion.pointer = null;
    motion.dragging = false;
    if (reducedRef.current || paused || event.type === "pointercancel") motion.velocity = 0;
    delete event.currentTarget.dataset.dragging;
    wakeRef.current();
  }

  return (
    <div className={`mark-orbit${background ? " mark-orbit--background" : ""}`} role={background ? undefined : "region"} aria-label={background ? undefined : "チームマークの回転棚"} aria-roledescription={background ? undefined : "カルーセル"}
      style={{ "--orbit-spacing": 1.04 / (2 * Math.tan(Math.PI / works.length)), "--orbit-start-angle": `${-180 / works.length}deg` } as CSSProperties}>
      {!background ? <div className="mark-orbit__topline"><span aria-hidden="true" /><span>{String(front + 1).padStart(2, "0")} <i>/ {String(works.length).padStart(2, "0")}</i></span></div> : null}
      <div ref={viewportRef} className="mark-orbit__viewport" aria-hidden={background || undefined} inert={background || undefined}
        onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerEnd} onPointerCancel={pointerEnd}
        onClickCapture={(event) => {
          if (performance.now() < motionRef.current.suppressUntil) { event.preventDefault(); event.stopPropagation(); }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault(); moveBy(event.key === "ArrowRight" ? 1 : -1);
          }
        }}>
        <div className="mark-orbit__perspective">
          <div ref={rotorRef} className="mark-orbit__rotor">
            {works.map((work, index) => (
              <div className="mark-orbit__slot" key={work.teamId} style={{ "--slot-angle": `${index * step}deg` } as CSSProperties}>
                {background ? <div className="mark-orbit__card">{work.mark ? <TeamMark mark={work.mark} size={400} priority={index < 2 || index > works.length - 3} /> : null}</div> : <button type="button" className="mark-orbit__card" tabIndex={front === index ? 0 : -1}
                  aria-label={getPlayLabel(work)} aria-haspopup="dialog"
                  onMouseEnter={() => { motionRef.current.hovering = true; motionRef.current.velocity = 0; }}
                  onMouseLeave={() => { motionRef.current.hovering = false; wakeRef.current(); }}
                  onFocus={() => { motionRef.current.focusing = true; motionRef.current.velocity = 0; }}
                  onBlur={() => { motionRef.current.focusing = false; wakeRef.current(); }}
                  onClick={(event) => open?.(work.id, event.currentTarget)}>
                  {work.mark ? <TeamMark mark={work.mark} size={400} priority={index < 5} /> : null}
                  <span className="mark-orbit__card-caption"><span>{work.teamName}</span><span aria-hidden="true">▶</span></span>
                </button>}
              </div>
            ))}
          </div>
        </div>
      </div>
      {background ? <div className="mark-orbit__background-control"><button type="button" onClick={() => setPaused((current) => !current)} aria-pressed={paused} aria-label={paused ? "背景の動きを再開" : "背景の動きを止める"}><span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span> {paused ? "背景を動かす" : "背景を止める"}</button></div> : <div className="mark-orbit__bottomline">
        <div className="mark-orbit__controls">
          <button type="button" onClick={() => moveBy(-1)} aria-label="前のチームへ">←</button>
          <button type="button" onClick={() => { motionRef.current.velocity = 0; motionRef.current.target = null; setPaused(!paused); }} aria-pressed={paused} aria-label={paused ? "自動回転を再開" : "自動回転を停止"}>{paused ? "▶" : "Ⅱ"}</button>
          <button type="button" onClick={() => moveBy(1)} aria-label="次のチームへ">→</button>
        </div>
      </div>}
    </div>
  );
}
