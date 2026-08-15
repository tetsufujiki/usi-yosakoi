import type { CSSProperties } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";

const yearPalettes = [
  { deep: "#26070D", mid: "#681524", accent: "#D92F3D", light: "#F0AD3D" },
  { deep: "#171E36", mid: "#293F72", accent: "#5C81C7", light: "#D8B96A" },
  { deep: "#132B2A", mid: "#235A50", accent: "#4D9A7E", light: "#E0B85C" },
  { deep: "#32150D", mid: "#78321E", accent: "#D46535", light: "#F1BA5B" },
  { deep: "#251126", mid: "#59305F", accent: "#9A5795", light: "#E1A86B" },
  { deep: "#15262E", mid: "#285769", accent: "#4F91A5", light: "#E5B85D" },
  { deep: "#2D1020", mid: "#6D2147", accent: "#C04473", light: "#F09B69" },
  { deep: "#22270F", mid: "#526226", accent: "#8A9D42", light: "#E7BB5B" },
  { deep: "#20172F", mid: "#47366E", accent: "#7963AA", light: "#DDB272" },
  { deep: "#31200B", mid: "#765018", accent: "#C78C2D", light: "#F0C669" },
  { deep: "#102A32", mid: "#1F6170", accent: "#3C9CAF", light: "#E6B75E" },
  { deep: "#321217", mid: "#792931", accent: "#C64B50", light: "#EAB267" },
  { deep: "#182616", mid: "#365D32", accent: "#65945A", light: "#DDB75D" },
  { deep: "#191D32", mid: "#394675", accent: "#687DB5", light: "#E4B767" },
  { deep: "#301126", mid: "#702A59", accent: "#B94F89", light: "#E5AA67" },
  { deep: "#292014", mid: "#66502A", accent: "#AA8541", light: "#EBC36A" },
  { deep: "#122929", mid: "#2D6260", accent: "#579894", light: "#DFB866" },
  { deep: "#2E1510", mid: "#70402B", accent: "#B96843", light: "#E9B56A" },
  { deep: "#22152D", mid: "#52366C", accent: "#8663A2", light: "#DDB475" },
].map((palette) => ({
  ...palette,
  accentSoft: `color-mix(in srgb, ${palette.accent} 36%, transparent)`,
  ink: "#FFF6E2",
}));

const thumbnailVariants = ["formation", "surge", "pulse", "flow"] as const;

export type ThumbnailStyle = CSSProperties & {
  "--thumb-deep": string;
  "--thumb-mid": string;
  "--thumb-accent": string;
  "--thumb-accent-soft": string;
  "--thumb-light": string;
  "--thumb-ink": string;
  "--thumb-angle": string;
  "--thumb-arc-x": string;
  "--thumb-arc-y": string;
  "--thumb-trace-y": string;
};

export function stableHash(value: string) {
  let hash = 2166136261;

  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
}

export function getThumbnailTheme(work: YosakoiWork) {
  const teamHash = stableHash(work.teamId);
  const newestYear = Math.max(...work.years);
  const yearOffset =
    (((2026 - newestYear) % yearPalettes.length) + yearPalettes.length) %
    yearPalettes.length;
  const palette = yearPalettes[yearOffset];
  const variant =
    work.thumbnailVariant ??
    thumbnailVariants[teamHash % thumbnailVariants.length];
  const angle = 16 + (teamHash % 34);
  const toneShift = 5 + ((teamHash >>> 6) % 11);
  const teamAccent = work.accentColor ?? palette.accent;
  const style: ThumbnailStyle = {
    "--thumb-deep": palette.deep,
    "--thumb-mid": `color-mix(in srgb, ${palette.mid} ${100 - toneShift}%, ${teamAccent})`,
    "--thumb-accent": teamAccent,
    "--thumb-accent-soft": palette.accentSoft,
    "--thumb-light": palette.light,
    "--thumb-ink": palette.ink,
    "--thumb-angle": `${angle}deg`,
    "--thumb-arc-x": `${-12 + ((teamHash >>> 4) % 32)}%`,
    "--thumb-arc-y": `${-48 + ((teamHash >>> 9) % 36)}%`,
    "--thumb-trace-y": `${18 + ((teamHash >>> 14) % 48)}%`,
  };

  return {
    variant,
    style,
  };
}

export function formatYears(years: number[]) {
  if (years.length === 0) return "";
  if (years.length === 1) return String(years[0]);

  return `${years[0]}–${String(years.at(-1)).slice(-2)}`;
}

export function getYoutubeUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function extractYoutubeId(value: string) {
  const trimmedValue = value.trim();

  if (/^[A-Za-z0-9_-]{11}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  try {
    const url = new URL(trimmedValue);
    const hostname = url.hostname.replace(/^www\./, "");

    if (hostname === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0];
    }

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      if (url.pathname === "/watch") {
        return url.searchParams.get("v") ?? undefined;
      }

      const [, route, id] = url.pathname.split("/");
      if (route === "shorts" || route === "embed") {
        return id || undefined;
      }
    }
  } catch {
    return undefined;
  }

  return undefined;
}

export function getYoutubeEmbedUrl(youtubeId: string, autoplay = false) {
  const playbackParameters = autoplay ? "&autoplay=1&playsinline=1" : "";

  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0${playbackParameters}`;
}

export function sortWorksNewestFirst(works: YosakoiWork[]) {
  return [...works].sort((a, b) => {
    const yearDifference = Math.max(...b.years) - Math.max(...a.years);
    if (yearDifference !== 0) return yearDifference;

    return (a.order ?? 999) - (b.order ?? 999);
  });
}
