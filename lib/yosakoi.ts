import type { CSSProperties } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";

const yearPalettes = [
  {
    deep: "#342326",
    mid: "#67403D",
    accent: "#C06A50",
    accentSoft: "rgba(192, 106, 80, 0.34)",
    light: "#E1B17D",
    ink: "#FFF7EA",
  },
  {
    deep: "#332A20",
    mid: "#66513A",
    accent: "#C48A45",
    accentSoft: "rgba(196, 138, 69, 0.33)",
    light: "#E2C07B",
    ink: "#FFF8E9",
  },
  {
    deep: "#263047",
    mid: "#435778",
    accent: "#758EC3",
    accentSoft: "rgba(117, 142, 195, 0.34)",
    light: "#BAC8DF",
    ink: "#F9F7ED",
  },
  {
    deep: "#203734",
    mid: "#35665C",
    accent: "#65A08F",
    accentSoft: "rgba(101, 160, 143, 0.33)",
    light: "#B6D1C3",
    ink: "#F9F7EA",
  },
  {
    deep: "#332839",
    mid: "#62455F",
    accent: "#9A708F",
    accentSoft: "rgba(154, 112, 143, 0.34)",
    light: "#CEAEC5",
    ink: "#FFF7EA",
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
