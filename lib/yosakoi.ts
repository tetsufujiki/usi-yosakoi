import type { CSSProperties } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";

const yearPalettes = [
  {
    deep: "#2E222B",
    mid: "#653F44",
    accent: "#C76B52",
    accentSoft: "rgba(199, 107, 82, 0.34)",
    light: "#E0B183",
    ink: "#FFF7EA",
  },
  {
    deep: "#2D2A22",
    mid: "#5F513C",
    accent: "#C08C4C",
    accentSoft: "rgba(192, 140, 76, 0.33)",
    light: "#E0C07E",
    ink: "#FFF8E9",
  },
  {
    deep: "#1C2B44",
    mid: "#3C5A82",
    accent: "#6E94CB",
    accentSoft: "rgba(110, 148, 203, 0.34)",
    light: "#B5C9E2",
    ink: "#F9F7ED",
  },
  {
    deep: "#18313D",
    mid: "#2D5E6E",
    accent: "#57A2B5",
    accentSoft: "rgba(87, 162, 181, 0.33)",
    light: "#AFD2DB",
    ink: "#F9F7EA",
  },
  {
    deep: "#2B273E",
    mid: "#524A78",
    accent: "#8B7FB3",
    accentSoft: "rgba(139, 127, 179, 0.34)",
    light: "#C6BCDC",
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
