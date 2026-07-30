import Link from "next/link";
import {
  type KineticsVariant,
  YosakoiHeroKinetics,
} from "@/components/YosakoiHeroKinetics";

type SiteFooterProps = {
  kineticsVariant?: Extract<KineticsVariant, "finale">;
};

export function SiteFooter({ kineticsVariant }: SiteFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      {kineticsVariant ? (
        <YosakoiHeroKinetics variant={kineticsVariant} />
      ) : null}
      <div className="site-footer__inner">
        <div>
          <p className="site-footer__eyebrow">YOSAKOI SOUND WORKS</p>
          <p className="site-footer__statement">
            <span>チームの中にある</span>
            <br className="site-footer__break site-footer__break--mobile" />
            <span>物語を、</span>
            <br className="site-footer__break site-footer__break--desktop" />
            <span>演舞を動かす</span>
            <br className="site-footer__break site-footer__break--mobile" />
            <span>音楽へ。</span>
          </p>
        </div>

        <div className="site-footer__links">
          <Link href="/">楽曲制作</Link>
          <Link href="/archive">歴代作品</Link>
          <Link href="/contact">お問合せ</Link>
        </div>
      </div>
      <div className="site-footer__base">
        <a
          href="https://united-studio.com"
          target="_blank"
          rel="noreferrer"
        >
          ©{currentYear} ユナイテッドスタジオ株式会社
        </a>
      </div>
    </footer>
  );
}
