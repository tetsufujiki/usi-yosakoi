import Link from "next/link";

export function PreviewNextNote({ current }: { current: "a" | "b" }) {
  const other =
    current === "a"
      ? { href: "/preview/hero-b", label: "B案（HOTAERU映像）を見る" }
      : { href: "/preview/hero-a", label: "A案（年度別アーカイブ）を見る" };

  return (
    <section className="v2-note" aria-labelledby="preview-note-title">
      <p className="v2-note__label">比較プレビュー</p>
      <h2 id="preview-note-title" className="v2-note__title">
        この先の章は、採用案の決定後に作り直します。
      </h2>
      <p className="v2-note__body">
        國士舞双の章、制作姿勢、相談の導線、フッターは、採用したHEROに合わせて同じ配色方針で再構成します。
      </p>
      <Link className="v2-note__link" href={other.href}>
        {other.label}
        <span aria-hidden="true">→</span>
      </Link>
    </section>
  );
}
