import type { Metadata } from "next";
import Link from "next/link";
import { MarkOrbitBackground } from "@/components/studio/MarkOrbit";
import { yosakoiWorks } from "@/data/yosakoi-works";
import { buildStageArchive } from "@/lib/year-archive";
import { getOrbitWorks } from "@/lib/studio-orbit";
import { StudioShell } from "@/components/studio/StudioShell";
import { StudioInvitation } from "@/components/studio/StudioApproach";

export const metadata: Metadata = {
  title: "制作について",
  description:
    "ヒアリング、響きの探索、作編曲、収録、ミックス・マスタリングまで。UNITED STUDIOのよさこい演舞楽曲の制作の進め方と、よくいただく質問です。",
  alternates: {
    canonical: "/process",
  },
};

const finishingProcesses = [
  {
    title: "Mixing",
    copy: "音量や音色、響き、奥行きを細かく調整し、楽曲全体のバランスを整えます。それぞれの音が持つ力を引き出し、演舞を動かす一つの音楽へとまとめていきます。",
  },
  {
    title: "Mastering",
    copy: "会場の広さや音響環境が異なる中でも、できるだけ踊り子に届き、演舞を支える音になるよう、全体の音圧や響きを整えます。地方車で使用する音源も、それぞれの再生環境を考慮しながら、この工程で仕上げます。",
  },
];

const process = [
  ["ヒアリング", "テーマ、演舞構成、目指す方向性を聞きながら、その作品が向かう先を一緒に探ります。"],
  [
    "響きの探索",
    "リズム、音色、フレーズを試しながら、曲が動き始めるきっかけとなる「音の種」を探します。",
  ],
  [
    "作編曲",
    "音の種を広げながら、一つの世界としてまとめていきます。チームの個性と演舞にふさわしい楽曲へと育てます。",
  ],
  ["収録", "形になった楽曲に、生楽器、歌、掛け声などを重ねます。リアルな響きを加え、作品にさらに表情を与えていきます。"],
  ["仕上げ", "ミックス・マスタリングで音を磨き、演舞用音源としてひとつの作品に実らせます。"],
];

const studioUrl = "https://studio.united-studio.com";

const faqs = [
  {
    question: "遠方のチームでも依頼できますか？",
    answer:
      "はい。オンラインでの打ち合わせやデータ共有で、全国のチームに対応しています。",
  },
  {
    question: "制作期間はどれくらいですか？",
    answer:
      "内容や時期によって変わります。年間スケジュールに基づいて新規チームさんの制作期間を設定します。",
  },
  {
    question: "歌や掛け声の収録もできますか？",
    answer:
      <>はい。<a href={studioUrl}>弊社スタジオ</a>を使うのが最もクオリティーと自由度が高く録音可能ですが、出張してのレコーディングにも対応しております。</>,
  },
];

const orbitWorks = getOrbitWorks(buildStageArchive(yosakoiWorks));

export default function ProcessPage() {
  return <StudioShell>
    <section className="studio-document-head studio-process-hero" aria-labelledby="process-page-title">
      <div className="studio-process-hero__background"><MarkOrbitBackground works={orbitWorks} /></div>
      <div className="studio-process-hero__copy">
      <p className="studio-section-label">制作について</p>
      <h1 id="process-page-title">演舞のために、<br />音楽をつくる。</h1>
      <p>テーマ、構成、踊り子の声。チームとの対話を出発点に、作編曲から収録、ミックス・マスタリングまで、一つの演舞に向き合います。</p>
      <Link className="studio-editorial-link" href="/#works">実際の作品を聴く <span aria-hidden="true">↑</span></Link>
      </div>
    </section>
    <section className="studio-document-section" aria-labelledby="process-title">
      <div className="studio-section-kicker"><h2 id="process-title">制作の流れ</h2><span>01—05</span></div>
      <ol className="studio-process-list">{process.map(([title, copy], index) => <li key={title}><span>{String(index+1).padStart(2,"0")}</span><h3>{title}</h3><p>{copy}</p></li>)}</ol>
    </section>
    <section className="studio-finishing" aria-labelledby="finishing-title">
      <div className="studio-section-kicker"><span>音の仕上げ</span><span>Mix &amp; Mastering</span></div>
      <h2 id="finishing-title">届く音に、仕上げる。</h2>
      <p className="studio-finishing__lead">作編曲した音楽を、演舞で力を発揮する音源へ。踊り子と会場に届く音を考え、最後の余韻に至るまで徹底して磨き上げます。</p>
      <div className="studio-finishing__processes">{finishingProcesses.map(item => <article key={item.title}><h3>{item.title}</h3><p>{item.copy}</p></article>)}</div>
      <a className="studio-editorial-link studio-finishing__studio-link" href={studioUrl}>制作スタジオの紹介 <span aria-hidden="true">↗</span></a>
    </section>
    <section className="studio-document-section studio-faq" aria-labelledby="faq-title"><h2 id="faq-title">よくいただく質問</h2>{faqs.map((faq,index)=><details key={faq.question}><summary><span>{String(index+1).padStart(2,"0")}</span>{faq.question}<i aria-hidden="true">＋</i></summary><p>{faq.answer}</p></details>)}</section>
    <StudioInvitation />
  </StudioShell>;
}
