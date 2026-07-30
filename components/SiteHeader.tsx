import Image from "next/image";
import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link
          className="site-identity"
          href="/"
          aria-label="Yosakoi Sound Works トップ"
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
          <Link href="/">楽曲制作</Link>
          <Link href="/archive">歴代作品</Link>
          <Link href="/contact">お問合せ</Link>
        </nav>
      </div>
    </header>
  );
}
