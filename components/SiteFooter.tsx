import Link from "next/link";
import {
  type KineticsVariant,
  YosakoiHeroKinetics,
} from "@/components/YosakoiHeroKinetics";

type SiteFooterProps = {
  kineticsVariant?: Extract<KineticsVariant, "finale">;
};

export function SiteFooter({ kineticsVariant }: SiteFooterProps) {
  return (
    <footer className="site-footer">
      {kineticsVariant ? (
        <YosakoiHeroKinetics variant={kineticsVariant} />
      ) : null}
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__eyebrow">YOSAKOI MUSIC</p>
          <p className="site-footer__statement">
            チームの中にある物語を、
            <br />
            演舞を動かす音楽へ。
          </p>
        </div>

        <div className="site-footer__links">
          <Link href="/">楽曲制作</Link>
          <Link href="/archive">作品アーカイブ</Link>
          <a href="mailto:info@united-studio.com">info@united-studio.com</a>
        </div>
      </div>
      <div className="site-footer__base">
        <small>© UNITED STUDIO INC</small>
        <small>Tokyo, Japan</small>
      </div>
    </footer>
  );
}
