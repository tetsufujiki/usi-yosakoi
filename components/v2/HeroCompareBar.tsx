import Link from "next/link";

const variants = [
  { id: "a", href: "/preview/hero-a", label: "年度別アーカイブ" },
  { id: "b", href: "/preview/hero-b", label: "HOTAERU映像" },
] as const;

export function HeroCompareBar({ current }: { current: "a" | "b" }) {
  return (
    <nav className="v2-compare" aria-label="HERO比較プレビュー">
      <span className="v2-compare__label">HERO比較</span>
      {variants.map((variant) => (
        <Link
          key={variant.id}
          href={variant.href}
          aria-current={variant.id === current ? "page" : undefined}
        >
          <span className="v2-compare__id">{variant.id.toUpperCase()}</span>
          <span className="v2-compare__name">{variant.label}</span>
        </Link>
      ))}
    </nav>
  );
}
