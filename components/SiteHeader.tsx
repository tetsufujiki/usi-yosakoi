import Image from "next/image";
import Link from "next/link";

type SiteSection = "home" | "archive" | "process" | "contact";

type SiteHeaderProps = {
  /** "light" sets ink text for pages that open on paper. */
  tone?: "light" | "dark";
  current?: SiteSection;
};

const navigation: Array<{
  href: string;
  label: string;
  compactLabel?: string;
  section?: SiteSection;
  optional?: boolean;
}> = [
  { href: "/archive", label: "作品アーカイブ", compactLabel: "作品", section: "archive" },
  { href: "/#kokushi", label: "國士舞双", optional: true },
  { href: "/process", label: "制作について", compactLabel: "制作", section: "process" },
  { href: "/contact", label: "お問合せ", section: "contact" },
];

export function SiteHeader({ tone = "dark", current }: SiteHeaderProps) {
  return (
    <header className={`site-header site-header--${tone}`}>
      <div className="site-header__inner">
        <Link
          className="site-identity"
          href="/"
          aria-label="Yosakoi Sound Works トップ"
          aria-current={current === "home" ? "page" : undefined}
        >
          <Image
            className="site-identity__icon"
            src="/usi_1024.png"
            alt=""
            width={1024}
            height={1024}
            sizes="24px"
            priority
          />
          <span>
            <strong>YOSAKOI SOUND WORKS</strong>
            <small>UNITED STUDIO INC</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="メインナビゲーション">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={item.optional ? "site-nav__optional" : undefined}
              aria-label={item.compactLabel ? item.label : undefined}
              aria-current={
                item.section && item.section === current ? "page" : undefined
              }
            >
              {item.compactLabel ? (
                <>
                  <span className="site-nav__full" aria-hidden="true">
                    {item.label}
                  </span>
                  <span className="site-nav__compact" aria-hidden="true">
                    {item.compactLabel}
                  </span>
                </>
              ) : (
                item.label
              )}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
