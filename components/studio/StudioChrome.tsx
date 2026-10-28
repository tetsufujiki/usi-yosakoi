import Image from "next/image";
import Link from "next/link";

export function StudioHeader({ home = false }: { home?: boolean }) {
  return <header id="top" className="studio-header">
    <a href={home ? "#top" : "/"} className="studio-brand" aria-label="UNITED STUDIO トップ">
      <Image src="/usi_1024.png" alt="USI" width={38} height={38} unoptimized priority />
      <span>UNITED STUDIO INC.<small>よさこい演舞音楽制作</small></span>
    </a>
    <nav aria-label="メインナビゲーション">
      <a href={home ? "#works" : "/#works"}>作品を聴く <span aria-hidden="true">↗</span></a>
      <a href={home ? "#kokushi" : "/#kokushi"}>チームとの歩み <span aria-hidden="true">↗</span></a>
      <Link href="/process">制作について <span aria-hidden="true">↗</span></Link>
    </nav>
  </header>;
}

export function StudioFooter({ home = false }: { home?: boolean }) {
  return <footer className="studio-end">
    <div className="studio-end__brand"><Link href="https://united-studio.com">UNITED STUDIO INC. <span aria-hidden="true">↗</span></Link><p>よさこい演舞音楽制作</p></div>
    <nav aria-label="フッターナビゲーション">
      <a href={home ? "#works" : "/#works"}>作品を聴く</a>
      <a href={home ? "#kokushi" : "/#kokushi"}>チームとの歩み</a>
      <Link href="/process">制作について</Link>
      <Link href="/contact">制作の相談</Link>
    </nav>
    <div className="studio-end__bottom"><small>© UNITED STUDIO INC.</small><a href={home ? "#top" : "/"}>トップへ ↑</a></div>
  </footer>;
}
