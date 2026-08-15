import type { CSSProperties } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";

const yearPalettes = [
  {
    deep: "#2B090F",
    mid: "#681524",
    accent: "#D52D36",
    accentSoft: "rgba(213, 45, 54, 0.36)",
    light: "#F2A34A",
    ink: "#FFF6E2",
  },
  {
    deep: "#32100B",
    mid: "#7B2418",
    accent: "#E6552F",
    accentSoft: "rgba(230, 85, 47, 0.36)",
    light: "#F2B24B",
    ink: "#FFF7E8",
  },
  {
    deep: "#300812",
    mid: "#73112B",
    accent: "#C9254B",
    accentSoft: "rgba(201, 37, 75, 0.36)",
    light: "#ED8062",
    ink: "#FFF4E7",
  },
  {
    deep: "#281016",
    mid: "#5C1C25",
    accent: "#B84538",
    accentSoft: "rgba(184, 69, 56, 0.35)",
    light: "#DDA15E",
    ink: "#FFF6E5",
  },
  {
    deep: "#260A20",
    mid: "#59133F",
    accent: "#A92D57",
    accentSoft: "rgba(169, 45, 87, 0.36)",
    light: "#E38B72",
    ink: "#FFF5E8",
  },
] as const;

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
  const style: ThumbnailStyle = {
    "--thumb-deep": palette.deep,
    "--thumb-mid": palette.mid,
    "--thumb-accent": work.accentColor ?? palette.accent,
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
