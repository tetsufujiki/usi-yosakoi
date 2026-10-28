import Image from "next/image";
import Link from "next/link";

const navigation = [
  { href: "#archive", label: "作品" },
  { href: "/#kokushi", label: "國士舞双" },
  { href: "/process", label: "制作について", optional: true },
  { href: "/contact", label: "お問合せ" },
];

export function StageHeader() {
  return (
    <header className="v2-header">
      <Link className="v2-brand" href="/" aria-label="Yosakoi Sound Works トップ">
        <Image
          className="v2-brand__icon"
          src="/usi_1024.png"
          alt=""
          width={1024}
          height={1024}
          sizes="28px"
          priority
        />
        <span className="v2-brand__text">
          <strong>YOSAKOI SOUND WORKS</strong>
          <small>UNITED STUDIO INC</small>
        </span>
      </Link>

      <nav className="v2-nav" aria-label="メインナビゲーション">
        {navigation.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={item.optional ? "v2-nav__optional" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
