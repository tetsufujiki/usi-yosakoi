import Image from "next/image";
import type { TeamMarkAsset } from "@/lib/team-marks";

type TeamMarkProps = {
  mark: TeamMarkAsset;
  /** Black for light backgrounds, white for dark backgrounds. */
  tone?: "black" | "white";
  /** Intrinsic square size in px. CSS controls the rendered size. */
  size?: number;
  alt?: string;
  className?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
};

export function TeamMark({
  mark,
  tone = "black",
  size = 160,
  alt = "",
  className,
  priority = false,
  loading,
}: TeamMarkProps) {
  return (
    <Image
      className={className ? `team-mark ${className}` : "team-mark"}
      src={tone === "white" ? mark.white : mark.black}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      loading={loading}
      unoptimized
      draggable={false}
    />
  );
}
