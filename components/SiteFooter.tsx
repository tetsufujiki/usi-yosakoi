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
            チームの中にある物語を、
            <br />
            演舞を動かす音楽へ。
          </p>
        </div>

        <div className="site-footer__links">
          <Link href="/">楽曲制作</Link>
          <Link href="/archive">作品アーカイブ</Link>
          <Link href="/contact">お問い合わせ</Link>
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
