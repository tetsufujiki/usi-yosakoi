import type { CSSProperties } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";

const thumbnailPalettes = [
  { deep: "#183C46", accent: "#E66B42", light: "#F2C76E", ink: "#FFF8E9" },
  { deep: "#252B55", accent: "#D34E69", light: "#8DD4C7", ink: "#FFF9ED" },
  { deep: "#4A263D", accent: "#E9784E", light: "#E9B65B", ink: "#FFF8EC" },
  { deep: "#153D34", accent: "#D9533F", light: "#A6D0A3", ink: "#FFF9ED" },
  { deep: "#313641", accent: "#C85136", light: "#D9A84E", ink: "#FFF8EB" },
  { deep: "#173758", accent: "#D84C5F", light: "#78C1C7", ink: "#FFF8EC" },
] as const;

const thumbnailVariants = ["formation", "surge", "pulse", "flow"] as const;

export type ThumbnailStyle = CSSProperties & {
  "--thumb-deep": string;
  "--thumb-accent": string;
  "--thumb-light": string;
  "--thumb-ink": string;
  "--thumb-angle": string;
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
  const workHash = stableHash(`${work.teamId}:${work.years.join("-")}:${work.id}`);
  const palette = thumbnailPalettes[teamHash % thumbnailPalettes.length];
  const variant =
    work.thumbnailVariant ??
    thumbnailVariants[workHash % thumbnailVariants.length];
  const angle = 18 + (workHash % 34);
  const style: ThumbnailStyle = {
    "--thumb-deep": palette.deep,
    "--thumb-accent": work.accentColor ?? palette.accent,
    "--thumb-light": palette.light,
    "--thumb-ink": palette.ink,
    "--thumb-angle": `${angle}deg`,
  };

  return {
    variant,
    style,
  };
}

export function formatYears(years: number[]) {
  if (years.length === 0) return "";
  if (years.length === 1) return String(years[0]);

  return `${years[0]} — ${String(years.at(-1)).slice(-2)}`;
}

export function getYoutubeUrl(youtubeId: string) {
  return `https://www.youtube.com/watch?v=${youtubeId}`;
}

export function getYoutubeEmbedUrl(youtubeId: string) {
  return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0`;
}

export function sortWorksNewestFirst(works: YosakoiWork[]) {
  return [...works].sort((a, b) => {
    const yearDifference = Math.max(...b.years) - Math.max(...a.years);
    if (yearDifference !== 0) return yearDifference;

    return (a.order ?? 999) - (b.order ?? 999);
  });
}
