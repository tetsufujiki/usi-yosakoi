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
          <span className="site-identity__mark" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          <span>
            <strong>YOSAKOI SOUND WORKS</strong>
            <small>UNITED STUDIO INC</small>
          </span>
        </Link>

        <nav className="site-nav" aria-label="メインナビゲーション">
          <Link href="/">楽曲制作</Link>
          <Link href="/archive">歴代作品アーカイブ</Link>
          <Link href="/contact">お問い合わせ</Link>
        </nav>
      </div>
    </header>
  );
}
