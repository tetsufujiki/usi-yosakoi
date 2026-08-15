"use client";

import { useEffect, useRef } from "react";

type RGB = readonly [number, number, number];

export type KineticsVariant = "hero" | "finale" | "contact";

type NodeScale = "small" | "medium" | "large";
type SpeedBand = "slow" | "medium" | "fast";

type MovingNode = {
  id: number;
  scale: NodeScale;
  speedBand: SpeedBand;
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  radius: number;
  color: RGB;
  baseAlpha: number;
  age: number;
  life: number;
  turnIn: number;
  collisionCooldown: number;
  chargeRemaining: number;
};

type Spark = {
  x: number;
  y: number;
  previousX: number;
  previousY: number;
  vx: number;
  vy: number;
  radius: number;
  color: RGB;
  age: number;
  life: number;
};

type ImpactRing = {
  kind: "burst" | "shockwave";
  scale: "normal" | "huge";
  x: number;
  y: number;
  startRadius: number;
  maximumRadius: number;
  lineWidth: number;
  baseAlpha: number;
  color: RGB;
  age: number;
  life: number;
};

type QuietZone = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  strength: number;
};

const palette: RGB[] = [
  [255, 246, 226],
  [244, 174, 52],
  [239, 106, 48],
  [221, 45, 52],
  [173, 22, 45],
];

const variantTuning = {
  hero: {
    opacity: 1,
    desktopMinimum: 28,
    desktopMaximum: 40,
    mobileMinimum: 12,
    mobileMaximum: 20,
    areaPerNode: 37000,
    maximumSparks: 96,
    maximumRings: 16,
    shockwaveMinimum: 0.58,
    shockwaveMaximum: 1.2,
    collisionShockwaveChance: 0.5,
    surgeShockwaveChance: 0.52,
    shockwaveCooldown: 1500,
    shockwaveIntervalMinimum: 3900,
    shockwaveIntervalMaximum: 6400,
  },
  finale: {
    opacity: 0.82,
    desktopMinimum: 18,
    desktopMaximum: 28,
    mobileMinimum: 9,
    mobileMaximum: 14,
    areaPerNode: 42000,
    maximumSparks: 58,
    maximumRings: 11,
    shockwaveMinimum: 0.52,
    shockwaveMaximum: 1.12,
    collisionShockwaveChance: 0.38,
    surgeShockwaveChance: 0.34,
    shockwaveCooldown: 2000,
    shockwaveIntervalMinimum: 5400,
    shockwaveIntervalMaximum: 8200,
  },
  contact: {
    opacity: 0.65,
    desktopMinimum: 14,
    desktopMaximum: 22,
    mobileMinimum: 7,
    mobileMaximum: 11,
    areaPerNode: 50000,
    maximumSparks: 40,
    maximumRings: 8,
    shockwaveMinimum: 0.5,
    shockwaveMaximum: 0.92,
    collisionShockwaveChance: 0.28,
    surgeShockwaveChance: 0.24,
    shockwaveCooldown: 2600,
    shockwaveIntervalMinimum: 6800,
    shockwaveIntervalMaximum: 9800,
  },
} as const;

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value));

const randomBetween = (minimum: number, maximum: number) =>
  minimum + Math.random() * (maximum - minimum);

const rgba = (color: RGB, alpha: number) =>
  `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;

const desktopSpeedRanges: Record<
  NodeScale,
  Record<SpeedBand, readonly [number, number]>
> = {
  small: {
    slow: [42, 82],
    medium: [90, 142],
    fast: [178, 265],
  },
  medium: {
    slow: [26, 52],
    medium: [55, 88],
    fast: [105, 145],
  },
  large: {
    slow: [12, 26],
    medium: [26, 42],
    fast: [52, 70],
  },
};

const mobileSpeedRanges: Record<
  NodeScale,
  Record<SpeedBand, readonly [number, number]>
> = {
  small: {
    slow: [34, 68],
    medium: [72, 115],
    fast: [135, 205],
  },
  medium: {
    slow: [22, 44],
    medium: [46, 72],
    fast: [82, 116],
  },
  large: {
    slow: [10, 22],
    medium: [22, 35],
    fast: [42, 58],
  },
};

function speedRangeFor(
  scale: NodeScale,
  speedBand: SpeedBand,
  mobile: boolean,
) {
  return (mobile ? mobileSpeedRanges : desktopSpeedRanges)[scale][speedBand];
}

function createNode(
  id: number,
  width: number,
  height: number,
  mobile: boolean,
  variant: KineticsVariant,
): MovingNode {
  const largeCount = mobile ? 1 : variant === "hero" ? 3 : 2;
  const mediumCount = mobile
    ? variant === "hero"
      ? 5
      : 3
    : variant === "hero"
      ? 10
      : 7;
  const scale: NodeScale =
    id < largeCount
      ? "large"
      : id < largeCount + mediumCount
        ? "medium"
        : "small";
  const speedPosition = id % 10;
  const speedBand: SpeedBand =
    speedPosition < 6
      ? "slow"
      : speedPosition < 9
        ? "medium"
        : "fast";
  const angle = randomBetween(0, Math.PI * 2);
  const speedRange = speedRangeFor(scale, speedBand, mobile);
  const shortSide = Math.min(width, height);
  const radiusRange =
    scale === "small"
      ? mobile
        ? [1.2, 3.8]
        : [1.4, 5]
      : scale === "medium"
        ? mobile
          ? [7, 16]
          : [clamp(shortSide * 0.012, 10, 18), clamp(shortSide * 0.026, 20, 32)]
        : mobile
          ? [clamp(shortSide * 0.055, 22, 30), clamp(shortSide * 0.12, 38, 56)]
          : [clamp(shortSide * 0.045, 38, 58), clamp(shortSide * 0.09, 72, 104)];
  const alphaRange =
    scale === "small"
      ? [0.42, 0.86]
      : scale === "medium"
        ? [0.26, 0.56]
        : [0.13, 0.3];
  const speed = randomBetween(speedRange[0], speedRange[1]);
  const x = randomBetween(width * 0.02, width * 0.98);
  const y = randomBetween(height * 0.06, height * 0.96);

  return {
    id,
    scale,
    speedBand,
    x,
    y,
    previousX: x,
    previousY: y,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    radius: randomBetween(radiusRange[0], radiusRange[1]),
    color: palette[Math.floor(Math.random() * palette.length)],
    baseAlpha: randomBetween(alphaRange[0], alphaRange[1]),
    age: randomBetween(0, 2),
    life: randomBetween(scale === "large" ? 12 : 8, scale === "large" ? 24 : 18),
    turnIn: randomBetween(scale === "large" ? 1.2 : 0.4, scale === "large" ? 3.8 : 2.4),
    collisionCooldown: 0,
    chargeRemaining: 0,
  };
}

function limitSpeed(node: MovingNode, maximum: number) {
  const speed = Math.hypot(node.vx, node.vy);
  if (speed <= maximum) return;

  node.vx = (node.vx / speed) * maximum;
  node.vy = (node.vy / speed) * maximum;
}

function isInsideZone(x: number, y: number, zone: QuietZone) {
  return (
    x >= zone.left &&
    x <= zone.right &&
    y >= zone.top &&
    y <= zone.bottom
  );
}

type YosakoiHeroKineticsProps = {
  variant?: KineticsVariant;
};

export function YosakoiHeroKinetics({
  variant = "hero",
}: YosakoiHeroKineticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    if (!canvasElement) return;

    const contextValue = canvasElement.getContext("2d", {
      alpha: true,
      desynchronized: true,
    });
    if (!contextValue) return;

    const containerElement = canvasElement.parentElement;
    if (!containerElement) return;

    const canvas = canvasElement;
    const context = contextValue;
    const container = containerElement;
    const tuning = variantTuning[variant];

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const mobileQuery = window.matchMedia("(max-width: 720px)");

    let width = 0;
    let height = 0;
    let mobile = mobileQuery.matches;
    let nodes: MovingNode[] = [];
    let sparks: Spark[] = [];
    let rings: ImpactRing[] = [];
    let quietZones: QuietZone[] = [];
    let animationFrame = 0;
    let lastTime = performance.now();
    let lastBurstAt = 0;
    let lastShockwaveAt = Number.NEGATIVE_INFINITY;
    let reportedHugeCount = -1;
    let nextAmbientBurst = lastTime + randomBetween(850, 1700);
    let nextCharge = lastTime + randomBetween(900, 1700);
    let nextSurge = lastTime + randomBetween(2600, 4400);
    let nextShockwave =
      lastTime +
      randomBetween(
        variant === "hero" ? 1500 : 2200,
        variant === "hero" ? 2700 : 3600,
      );
    let surgeUntil = 0;
    let surgeAngle = -0.24;
    let resizeTimer: number | undefined;
    let isIntersecting = true;

    const maximumSparks = () =>
      mobile ? Math.round(tuning.maximumSparks * 0.58) : tuning.maximumSparks;
    const maximumRings = () =>
      mobile ? Math.max(6, Math.round(tuning.maximumRings * 0.64)) : tuning.maximumRings;

    function nodeCount() {
      if (mobile) {
        return clamp(
          Math.floor((width * height) / (tuning.areaPerNode * 0.88)),
          tuning.mobileMinimum,
          tuning.mobileMaximum,
        );
      }

      return clamp(
        Math.floor((width * height) / tuning.areaPerNode),
        tuning.desktopMinimum,
        tuning.desktopMaximum,
      );
    }

    function updateQuietZones() {
      const canvasRect = canvas.getBoundingClientRect();
      const zoneDefinitions =
        variant === "hero"
          ? [
              [".hero__copy", 0.66, 18],
              [".hero__actions", 0.46, 14],
              [".site-header__inner", 0.54, 12],
            ]
          : variant === "finale"
            ? [
                [".site-footer__statement", 0.62, 16],
                [".site-footer__links", 0.42, 12],
                [".site-footer__base", 0.5, 10],
              ]
            : [
                [".contact-hero__inner", 0.52, 18],
                [".contact-form-section__content", 0.44, 18],
                [".contact-form", 0.38, 14],
              ];

      quietZones = zoneDefinitions.flatMap(([selector, strength, padding]) => {
        const element =
          container.querySelector<HTMLElement>(String(selector)) ??
          document.querySelector<HTMLElement>(String(selector));
        if (!element) return [];

        const rect = element.getBoundingClientRect();
        const inset = Number(padding);

        return [
          {
            left: rect.left - canvasRect.left - inset,
            top: rect.top - canvasRect.top - inset,
            right: rect.right - canvasRect.left + inset,
            bottom: rect.bottom - canvasRect.top + inset,
            strength: Number(strength),
          },
        ];
      });
    }

    function visibilityAt(x: number, y: number): number {
      return quietZones.reduce<number>(
        (alpha, zone) =>
          isInsideZone(x, y, zone) ? alpha * zone.strength : alpha,
        Number(tuning.opacity),
      );
    }

    function resetNodes() {
      nodes = Array.from({ length: nodeCount() }, (_, index) =>
        createNode(index, width, height, mobile, variant),
      );
      sparks = [];
      rings = [];
      reportedHugeCount = -1;
      canvas.dataset.nodes = String(nodes.length);
      canvas.dataset.speedMix = "slow-60 medium-30 fast-10";
      canvas.dataset.hugeShockwaves = "0";
    }

    function sizeCanvas() {
      const bounds = container.getBoundingClientRect();
      width = Math.max(1, bounds.width);
      height = Math.max(1, bounds.height);
      mobile = mobileQuery.matches;

      const pixelRatio = Math.min(
        window.devicePixelRatio || 1,
        mobile ? 1.25 : 1.6,
      );

      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

      updateQuietZones();
      resetNodes();
    }

    function createBurst(
      x: number,
      y: number,
      intensity = 1,
      preferredColor?: RGB,
    ) {
      const color =
        preferredColor ??
        palette[Math.floor(Math.random() * palette.length)];
      const particleCount = Math.round(
        randomBetween(mobile ? 3 : 4, mobile ? 6 : 8) * intensity,
      );
      const shortSide = Math.min(width, height);

      rings.push({
        kind: "burst",
        scale: "normal",
        x,
        y,
        startRadius: randomBetween(3, 9),
        maximumRadius: randomBetween(
          mobile ? 52 : 82,
          Math.min(shortSide * 0.24, mobile ? 116 : 210),
        ) * intensity,
        lineWidth: randomBetween(0.7, 1.7),
        baseAlpha: randomBetween(0.38, 0.72) * tuning.opacity,
        color,
        age: 0,
        life: randomBetween(0.72, 1.28),
      });

      for (let index = 0; index < particleCount; index += 1) {
        const angle =
          (Math.PI * 2 * index) / particleCount + randomBetween(-0.34, 0.34);
        const speed = randomBetween(
          mobile ? 82 : 105,
          mobile ? 205 : 285,
        );

        sparks.push({
          x,
          y,
          previousX: x,
          previousY: y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: randomBetween(0.8, mobile ? 2.2 : 2.8),
          color:
            Math.random() < 0.72
              ? color
              : palette[Math.floor(Math.random() * palette.length)],
          age: 0,
          life: randomBetween(0.38, 0.94),
        });
      }

      if (sparks.length > maximumSparks()) {
        sparks.splice(0, sparks.length - maximumSparks());
      }
      if (rings.length > maximumRings()) {
        rings.splice(0, rings.length - maximumRings());
      }
    }

    function createShockwave(
      x: number,
      y: number,
      now: number,
      strength = 1,
      preferredColor?: RGB,
    ): boolean {
      const activeHugeCount = rings.reduce(
        (count, ring) => count + (ring.scale === "huge" ? 1 : 0),
        0,
      );
      if (
        activeHugeCount >= 3 ||
        now - lastShockwaveAt < tuning.shockwaveCooldown
      ) {
        return false;
      }

      const shortSide = Math.min(width, height);
      const radiusRatio = clamp(
        randomBetween(
          tuning.shockwaveMinimum,
          tuning.shockwaveMaximum,
        ) * clamp(strength, 0.88, 1.18),
        0.5,
        Math.min(1.2, tuning.shockwaveMaximum),
      );
      const maximumRadius = shortSide * radiusRatio;
      const startRadius =
        shortSide *
        randomBetween(
          mobile ? 0.09 : 0.1,
          mobile ? 0.19 : 0.23,
        );

      rings.push({
        kind: "shockwave",
        scale: "huge",
        x,
        y,
        startRadius,
        maximumRadius,
        lineWidth: randomBetween(mobile ? 1.05 : 1.2, mobile ? 2.15 : 2.65),
        baseAlpha:
          randomBetween(
            variant === "hero" ? 0.28 : 0.25,
            variant === "hero" ? 0.48 : 0.44,
          ) * tuning.opacity,
        color:
          preferredColor ??
          palette[Math.floor(Math.random() * palette.length)],
        age: 0,
        life: randomBetween(mobile ? 1.35 : 1.55, mobile ? 2.35 : 2.85),
      });

      if (rings.length > maximumRings()) {
        rings.splice(0, rings.length - maximumRings());
      }
      lastShockwaveAt = now;
      reportedHugeCount = activeHugeCount + 1;
      canvas.dataset.hugeShockwaves = String(reportedHugeCount);
      return true;
    }

    function scheduleCollisionCharge(now: number) {
      if (nodes.length < 2) return;

      const collisionCandidates = nodes.filter(
        (node) => node.scale !== "small",
      );
      const candidatePool =
        collisionCandidates.length >= 2 ? collisionCandidates : nodes;
      const first = candidatePool[
        Math.floor(Math.random() * candidatePool.length)
      ];
      let second = candidatePool[
        Math.floor(Math.random() * candidatePool.length)
      ];
      if (second.id === first.id) {
        const currentIndex = candidatePool.indexOf(second);
        second = candidatePool[(currentIndex + 1) % candidatePool.length];
      }

      const meetingX = randomBetween(width * 0.08, width * 0.94);
      const meetingY = randomBetween(height * 0.1, height * 0.9);
      const angle = randomBetween(0, Math.PI * 2);
      const distance = randomBetween(mobile ? 68 : 105, mobile ? 124 : 190);
      const speed = randomBetween(mobile ? 112 : 148, mobile ? 168 : 214);

      const configure = (
        node: MovingNode,
        x: number,
        y: number,
        colorOffset: number,
      ) => {
        node.x = clamp(x, 12, width - 12);
        node.y = clamp(y, 12, height - 12);
        node.previousX = node.x;
        node.previousY = node.y;

        const dx = meetingX - node.x;
        const dy = meetingY - node.y;
        const magnitude = Math.max(1, Math.hypot(dx, dy));

        node.vx = (dx / magnitude) * speed;
        node.vy = (dy / magnitude) * speed;
        if (node.scale === "medium") {
          node.radius = randomBetween(mobile ? 8 : 13, mobile ? 17 : 25);
          node.baseAlpha = randomBetween(0.38, 0.62);
        } else if (node.scale === "large") {
          node.radius = randomBetween(mobile ? 26 : 46, mobile ? 52 : 92);
          node.baseAlpha = randomBetween(0.17, 0.32);
        }
        node.color = palette[(node.id + colorOffset) % palette.length];
        node.age = 0;
        node.life = randomBetween(7, 12);
        node.turnIn = randomBetween(1.1, 2);
        node.collisionCooldown = 0;
        node.chargeRemaining = randomBetween(0.72, 1.05);
      };

      configure(
        first,
        meetingX - Math.cos(angle) * distance,
        meetingY - Math.sin(angle) * distance,
        1,
      );
      configure(
        second,
        meetingX + Math.cos(angle) * distance,
        meetingY + Math.sin(angle) * distance,
        3,
      );

      nextCharge = now + randomBetween(
        variant === "hero" ? 1900 : 2600,
        variant === "hero" ? 3600 : 4800,
      );
    }

    function turnNode(node: MovingNode) {
      const speed = Math.hypot(node.vx, node.vy);
      const angle =
        Math.atan2(node.vy, node.vx) + randomBetween(-0.48, 0.48);
      const [minimumSpeed, maximumSpeed] = speedRangeFor(
        node.scale,
        node.speedBand,
        mobile,
      );
      const nextSpeed = clamp(
        speed * randomBetween(0.88, 1.16),
        minimumSpeed,
        maximumSpeed,
      );

      node.vx = Math.cos(angle) * nextSpeed;
      node.vy = Math.sin(angle) * nextSpeed;
      node.turnIn = randomBetween(
        node.scale === "large" ? 1.25 : 0.48,
        node.scale === "large" ? 4 : 2.6,
      );
    }

    function updateNodes(delta: number, now: number) {
      const surgeActive = now < surgeUntil;
      const surgeForce = surgeActive ? (mobile ? 58 : 76) : 0;

      for (const node of nodes) {
        node.previousX = node.x;
        node.previousY = node.y;
        node.age += delta;
        node.turnIn -= delta;
        node.chargeRemaining = Math.max(0, node.chargeRemaining - delta);
        node.collisionCooldown = Math.max(
          0,
          node.collisionCooldown - delta,
        );

        if (node.turnIn <= 0) turnNode(node);

        if (surgeActive) {
          node.vx += Math.cos(surgeAngle) * surgeForce * delta;
          node.vy += Math.sin(surgeAngle) * surgeForce * delta;
        }

        node.x += node.vx * delta;
        node.y += node.vy * delta;

        if (node.x <= node.radius || node.x >= width - node.radius) {
          node.x = clamp(node.x, node.radius, width - node.radius);
          node.vx *= -randomBetween(0.88, 1.08);
          node.vy += randomBetween(-24, 24);
        }

        if (node.y <= node.radius || node.y >= height - node.radius) {
          node.y = clamp(node.y, node.radius, height - node.radius);
          node.vy *= -randomBetween(0.88, 1.08);
          node.vx += randomBetween(-24, 24);
        }

        const [, bandMaximum] = speedRangeFor(
          node.scale,
          node.speedBand,
          mobile,
        );
        limitSpeed(
          node,
          node.chargeRemaining > 0
            ? mobile
              ? 175
              : 225
            : bandMaximum * (surgeActive ? 1.22 : 1.08),
        );

        if (node.age >= node.life) {
          Object.assign(
            node,
            createNode(node.id, width, height, mobile, variant),
          );
          node.age = 0;
        }
      }

      for (let firstIndex = 0; firstIndex < nodes.length; firstIndex += 1) {
        const first = nodes[firstIndex];

        for (
          let secondIndex = firstIndex + 1;
          secondIndex < nodes.length;
          secondIndex += 1
        ) {
          const second = nodes[secondIndex];
          const dx = second.x - first.x;
          const dy = second.y - first.y;
          const distance = Math.hypot(dx, dy);
          const threshold = first.radius + second.radius + (mobile ? 3 : 5);

          if (
            distance <= 0 ||
            distance > threshold ||
            first.collisionCooldown > 0 ||
            second.collisionCooldown > 0
          ) {
            continue;
          }

          const normalX = dx / distance;
          const normalY = dy / distance;
          const approachSpeed =
            (first.vx - second.vx) * normalX +
            (first.vy - second.vy) * normalY;

          if (approachSpeed <= 0) continue;

          first.vx -= approachSpeed * normalX * 1.08;
          first.vy -= approachSpeed * normalY * 1.08;
          second.vx += approachSpeed * normalX * 1.08;
          second.vy += approachSpeed * normalY * 1.08;

          const overlap = threshold - distance;
          first.x -= normalX * overlap * 0.5;
          first.y -= normalY * overlap * 0.5;
          second.x += normalX * overlap * 0.5;
          second.y += normalY * overlap * 0.5;

          first.collisionCooldown = 0.13;
          second.collisionCooldown = 0.13;
          first.chargeRemaining = 0;
          second.chargeRemaining = 0;
          limitSpeed(first, mobile ? 235 : 305);
          limitSpeed(second, mobile ? 235 : 305);

          if (now - lastBurstAt > 72) {
            const collisionX = first.x + dx * 0.5;
            const collisionY = first.y + dy * 0.5;
            const involvesLarge =
              first.scale === "large" || second.scale === "large";
            createBurst(
              collisionX,
              collisionY,
              clamp(approachSpeed / 170, 0.72, 1.22),
              Math.random() < 0.5 ? first.color : second.color,
            );
            if (
              involvesLarge &&
              Math.random() < tuning.collisionShockwaveChance
            ) {
              createShockwave(
                collisionX,
                collisionY,
                now,
                clamp(approachSpeed / 165, 1, 1.18),
                Math.random() < 0.5 ? first.color : second.color,
              );
            }
            lastBurstAt = now;
          }
        }
      }
    }

    function updateTransientParticles(delta: number) {
      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        spark.previousX = spark.x;
        spark.previousY = spark.y;
        spark.age += delta;
        spark.x += spark.vx * delta;
        spark.y += spark.vy * delta;
        spark.vx *= Math.pow(0.982, delta * 60);
        spark.vy *= Math.pow(0.982, delta * 60);

        if (spark.age >= spark.life) sparks.splice(index, 1);
      }

      for (let index = rings.length - 1; index >= 0; index -= 1) {
        const ring = rings[index];
        ring.age += delta;
        if (ring.age >= ring.life) rings.splice(index, 1);
      }

      const activeHugeCount = rings.reduce(
        (count, ring) => count + (ring.scale === "huge" ? 1 : 0),
        0,
      );
      if (activeHugeCount !== reportedHugeCount) {
        reportedHugeCount = activeHugeCount;
        canvas.dataset.hugeShockwaves = String(activeHugeCount);
      }
    }

    function drawSurge(now: number) {
      if (now >= surgeUntil) return;

      const progress = 1 - (surgeUntil - now) / 760;
      const offset = progress * width * 0.18;

      context.save();
      context.lineWidth = 1;

      for (let index = 0; index < 3; index += 1) {
        context.beginPath();
        context.moveTo(-width * 0.05 + offset, height * (0.35 + index * 0.16));
        context.lineTo(
          width * 1.05 + offset,
          height * (0.2 + index * 0.16),
        );
        context.strokeStyle = rgba(
          index === 1 ? palette[3] : palette[2],
          0.055 * Math.sin(Math.PI * clamp(progress, 0, 1)),
        );
        context.stroke();
      }

      context.restore();
    }

    function drawNodes() {
      for (const node of nodes) {
        const endFade = clamp((node.life - node.age) / 1.1, 0, 1);
        const startFade = clamp(node.age / 0.55, 0, 1);
        const alpha =
          node.baseAlpha *
          startFade *
          endFade *
          visibilityAt(node.x, node.y);
        const speed = Math.hypot(node.vx, node.vy);
        const trailDuration =
          node.scale === "small"
            ? clamp(speed / 2200, 0.045, 0.13)
            : node.scale === "medium"
              ? 0.035
              : 0.018;

        context.beginPath();
        context.moveTo(
          node.x - node.vx * trailDuration,
          node.y - node.vy * trailDuration,
        );
        context.lineTo(node.x, node.y);
        context.lineWidth =
          node.scale === "small"
            ? clamp(node.radius * 0.32, 0.65, 1.8)
            : clamp(node.radius * 0.07, 0.6, 1.4);
        context.strokeStyle = rgba(
          node.color,
          alpha *
            clamp(
              speed / (node.scale === "small" ? 190 : 230),
              node.scale === "large" ? 0.08 : 0.18,
              node.scale === "small" ? 0.72 : 0.38,
            ),
        );
        context.stroke();

        context.beginPath();
        context.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (node.scale !== "small") {
          context.lineWidth =
            node.scale === "large"
              ? clamp(node.radius * 0.012, 0.7, 1.25)
              : clamp(node.radius * 0.055, 0.8, 1.6);
          context.strokeStyle = rgba(node.color, alpha);
          context.stroke();

          if (node.scale === "medium") {
            context.beginPath();
            context.arc(
              node.x,
              node.y,
              Math.max(1, node.radius * 0.18),
              0,
              Math.PI * 2,
            );
            context.fillStyle = rgba(palette[0], alpha * 0.6);
            context.fill();
          } else {
            context.beginPath();
            context.arc(
              node.x,
              node.y,
              node.radius * 0.78,
              0,
              Math.PI * 2,
            );
            context.strokeStyle = rgba(node.color, alpha * 0.22);
            context.stroke();
          }
        } else {
          context.fillStyle = rgba(node.color, alpha);
          context.fill();
        }
      }
    }

    function drawTransientParticles() {
      for (const ring of rings) {
        const progress = ring.age / ring.life;
        const expansion = 1 - Math.pow(
          1 - progress,
          ring.kind === "shockwave" ? 3.2 : 2.2,
        );
        const radius =
          ring.startRadius +
          (ring.maximumRadius - ring.startRadius) * expansion;
        const appear = clamp(progress / 0.1, 0, 1);
        const shockwaveFade =
          progress < 0.58
            ? 1 - progress * 0.42
            : 0.756 *
              Math.pow(clamp((1 - progress) / 0.42, 0, 1), 1.22);
        const alpha =
          appear *
          (ring.kind === "shockwave"
            ? shockwaveFade
            : Math.pow(1 - progress, 1.1)) *
          ring.baseAlpha *
          visibilityAt(ring.x, ring.y);

        context.beginPath();
        context.arc(ring.x, ring.y, radius, 0, Math.PI * 2);
        context.lineWidth = Math.max(
          0.42,
          ring.lineWidth * (1 - progress * 0.46),
        );
        context.strokeStyle = rgba(ring.color, alpha);
        context.stroke();

        if (ring.kind === "shockwave") {
          context.beginPath();
          context.arc(ring.x, ring.y, radius * 0.86, 0, Math.PI * 2);
          context.lineWidth = Math.max(0.55, ring.lineWidth * 0.68);
          context.strokeStyle = rgba(ring.color, alpha * 0.34);
          context.stroke();
        }
      }

      for (const spark of sparks) {
        const progress = spark.age / spark.life;
        const alpha =
          (1 - progress) *
          0.86 *
          visibilityAt(spark.x, spark.y);

        context.beginPath();
        context.moveTo(spark.previousX, spark.previousY);
        context.lineTo(spark.x, spark.y);
        context.lineWidth = Math.max(0.55, spark.radius * (1 - progress));
        context.strokeStyle = rgba(spark.color, alpha);
        context.stroke();
      }
    }

    function drawStaticFormation() {
      context.clearRect(0, 0, width, height);
      context.save();

      const shortSide = Math.min(width, height);
      const staticNodes = [
        [0.08, 0.7, 2.2, "small"],
        [0.23, 0.26, 3.4, "small"],
        [0.38, 0.78, clamp(shortSide * 0.025, 9, 18), "medium"],
        [0.55, 0.38, clamp(shortSide * 0.045, 16, 34), "medium"],
        [0.72, 0.67, clamp(shortSide * 0.105, 38, 88), "large"],
        [0.91, 0.3, clamp(shortSide * 0.18, 64, 152), "large"],
      ] as const;

      for (let index = 0; index < staticNodes.length; index += 1) {
        const [x, y, radius, scale] = staticNodes[index];
        context.beginPath();
        context.arc(width * x, height * y, radius, 0, Math.PI * 2);
        if (scale === "small") {
          context.fillStyle = rgba(
            palette[index % palette.length],
            0.34 * visibilityAt(width * x, height * y),
          );
          context.fill();
        } else {
          context.lineWidth = scale === "large" ? 0.8 : 1.1;
          context.strokeStyle = rgba(
            palette[index % palette.length],
            (scale === "large" ? 0.16 : 0.24) *
              visibilityAt(width * x, height * y),
          );
          context.stroke();
        }
      }

      const traces = [
        [height * 0.24, -0.16],
        [height * 0.52, -0.23],
        [height * 0.84, -0.09],
      ];

      traces.forEach(([startY, angle], index) => {
        const length = width * (0.44 + index * 0.08);
        const startX = width * (0.06 + index * 0.25);
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(
          startX + Math.cos(angle) * length,
          startY + Math.sin(angle) * length,
        );
        context.strokeStyle = rgba(
          index === 1 ? palette[3] : palette[2],
          0.13 * tuning.opacity,
        );
        context.stroke();
      });

      context.restore();
    }

    function animate(now: number) {
      const delta = Math.min((now - lastTime) / 1000, 0.034);
      lastTime = now;

      if (now >= nextSurge) {
        surgeUntil = now + randomBetween(520, 820);
        surgeAngle = randomBetween(-0.42, 0.22);
        if (Math.random() < tuning.surgeShockwaveChance) {
          createShockwave(
            randomBetween(width * 0.08, width * 0.92),
            randomBetween(height * 0.12, height * 0.88),
            now,
            randomBetween(0.98, 1.16),
            Math.random() < 0.5 ? palette[0] : palette[2],
          );
        }
        nextSurge = now + randomBetween(3600, 6200);
      }

      if (now >= nextCharge) scheduleCollisionCharge(now);

      if (now >= nextAmbientBurst) {
        const x = randomBetween(width * 0.04, width * 0.96);
        const y = randomBetween(height * 0.08, height * 0.94);
        createBurst(x, y, randomBetween(0.62, 0.94));
        nextAmbientBurst = now + randomBetween(
          variant === "hero" ? 1050 : 1550,
          variant === "hero" ? 2200 : 2900,
        );
      }

      if (now >= nextShockwave) {
        createShockwave(
          randomBetween(width * 0.06, width * 0.94),
          randomBetween(height * 0.1, height * 0.9),
          now,
          randomBetween(0.94, 1.12),
          Math.random() < 0.42 ? palette[0] : undefined,
        );
        nextShockwave = now + randomBetween(
          tuning.shockwaveIntervalMinimum,
          tuning.shockwaveIntervalMaximum,
        );
      }

      updateNodes(delta, now);
      updateTransientParticles(delta);

      context.clearRect(0, 0, width, height);
      drawSurge(now);
      drawNodes();
      drawTransientParticles();

      animationFrame = window.requestAnimationFrame(animate);
    }

    function stopAnimation(mode: "paused" | "reduced") {
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
      canvas.dataset.motion = mode;
    }

    function startAnimation() {
      if (reducedMotion.matches) {
        stopAnimation("reduced");
        drawStaticFormation();
        return;
      }

      if (document.hidden || !isIntersecting || animationFrame) return;

      canvas.dataset.motion = "running";
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(animate);
    }

    function handleVisibilityChange() {
      if (document.hidden || !isIntersecting) {
        stopAnimation("paused");
      } else {
        startAnimation();
      }
    }

    function handleMotionPreference() {
      stopAnimation(reducedMotion.matches ? "reduced" : "paused");
      if (reducedMotion.matches) {
        drawStaticFormation();
      } else {
        startAnimation();
      }
    }

    function handleResize() {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        sizeCanvas();
        if (reducedMotion.matches) drawStaticFormation();
      }, 120);
    }

    sizeCanvas();

    const initialBounds = container.getBoundingClientRect();
    isIntersecting =
      initialBounds.bottom >= -120 &&
      initialBounds.top <= window.innerHeight + 120;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isIntersecting = entry.isIntersecting;
        if (isIntersecting) {
          startAnimation();
        } else {
          stopAnimation("paused");
        }
      },
      { rootMargin: "120px 0px" },
    );
    intersectionObserver.observe(container);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    reducedMotion.addEventListener("change", handleMotionPreference);
    mobileQuery.addEventListener("change", handleResize);

    startAnimation();

    return () => {
      stopAnimation("paused");
      window.clearTimeout(resizeTimer);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      reducedMotion.removeEventListener("change", handleMotionPreference);
      mobileQuery.removeEventListener("change", handleResize);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      className={`kinetics-canvas kinetics-canvas--${variant}`}
      aria-hidden="true"
      data-variant={variant}
    />
  );
}
