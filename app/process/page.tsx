import type { Metadata } from "next";
import Link from "next/link";
import { ClosingInvite } from "@/components/ClosingInvite";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";

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
    copy: "楽曲を構成する一つひとつの音に向き合い、音量や音色、響き、奥行きを細かく調整します。それぞれの音が持つ力を引き出しながら、演舞を動かす一つの音楽へとまとめていきます。",
  },
  {
    title: "Mastering",
    copy: "会場の広さや音響環境が異なる中でも、できるだけ踊り子に届き、演舞を支える音になるよう、全体の音圧や響きを整えます。地方車で使用する音源も、それぞれの再生環境を考慮しながら、この工程で仕上げます。",
  },
];

const process = [
  ["ヒアリング", "テーマ、演舞構成、希望する方向性を確認します。"],
  [
    "響きの探索",
    "リズム、音色、フレーズを試しながら、曲が動き始めるきっかけを探します。",
  ],
  [
    "作編曲",
    "音の種を広げながら、チームの個性と演舞に合う楽曲へと仕上げていきます。",
  ],
  ["収録", "歌、掛け声、楽器など必要な素材を録音します。"],
  ["仕上げ", "ミックス・マスタリングを行い、演舞用音源として完成させます。"],
];

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
      "はい。弊社スタジオを使うのが最もクオリティーと自由度が高く録音可能ですが、出張してのレコーディングにも対応しております。",
  },
];

export default function ProcessPage() {
  return (
    <>
      <SiteHeader tone="light" current="process" />
      <main id="main-content">
        <section className="page-head" aria-labelledby="process-page-title">
          <div className="frame page-head__inner">
            <p className="eyebrow">制作について</p>
            <h1 id="process-page-title">
              <span>一つの対話から、</span>
              <span>演舞を動かす音へ。</span>
            </h1>
            <p className="page-head__lead">
              ヒアリングから仕上げまで、演舞のための一曲ができるまでと、よくいただく質問をまとめています。実際の作品は
              <Link href="/archive">作品アーカイブ</Link>
              からご覧いただけます。
            </p>
          </div>
        </section>

        <section className="intro section" id="intro" aria-labelledby="intro-title">
          <div className="frame intro__grid">
            <div>
              <p className="section-label">ABOUT THE MUSIC</p>
              <h2 id="intro-title">
                <span className="intro__title-line">
                  <span>演舞のための</span>
                  <span>一曲を、</span>
                </span>
                <span className="intro__title-line">
                  <span>チームごとに</span>
                  <span>設計する。</span>
                </span>
              </h2>
            </div>
            <div className="intro__body">
              <p>
                UNITED STUDIOは、2008年より全国のよさこいチームへ演舞楽曲を制作してきました。
              </p>
              <p>
                作編曲、歌・楽器収録、掛け声、ミックス、マスタリングまで。
                チームにある物語を聞き、その演舞にしかない時間の流れを音楽へ変えていきます。
              </p>
              <div className="intro__note">
                <span>THE QUESTION</span>
                <strong>
                  <span>自分たちのチーム</span>
                  <span>なら、どんな曲に</span>
                  <span>なるだろう。</span>
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="process section section--ink"
          aria-labelledby="process-title"
        >
          <div className="frame">
            <div className="section-heading">
              <p className="section-label">FROM DIALOGUE TO PERFORMANCE</p>
              <h2 id="process-title">制作の流れ</h2>
            </div>

            <ol className="process-list">
              {process.map(([title, copy], index) => (
                <li key={title}>
                  <span className="process-list__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3>{title}</h3>
                    <p>{copy}</p>
                  </div>
                  <span className="process-list__pulse" aria-hidden="true" />
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          className="our-process section"
          aria-labelledby="our-process-title"
        >
          <div className="frame">
            <div className="our-process__intro">
              <div>
                <p className="section-label">OUR PROCESS</p>
                <h2 id="our-process-title">
                  <span>音が演舞を</span>
                  <span>動かすまで</span>
                </h2>
              </div>
              <div className="our-process__copy">
                <p>
                  チームとの対話から音の種を探し、楽曲として育て、最後の響きまで丁寧に仕上げる。音楽をつくるとは、作編曲だけではなく、音色の選択からミキシング、マスタリングに至るまで、すべての工程に向き合うことだと考えています。
                </p>
                <p className="our-process__statement">
                  <span>一つひとつの工程にどれだけこだわれるかが、</span>
                  <span>演舞を動かす音の説得力を決めます。</span>
                </p>
              </div>
            </div>

            <div className="finishing-process">
              <h3>Mix &amp; Mastering</h3>
              <div className="finishing-process__grid">
                {finishingProcesses.map((item) => (
                  <article
                    className={`finishing-process__item finishing-process__item--${item.title.toLowerCase()}`}
                    key={item.title}
                  >
                    <h4>{item.title}</h4>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="faq section" aria-labelledby="faq-title">
          <div className="frame faq__grid">
            <div className="section-heading">
              <p className="section-label">FAQ</p>
              <h2 id="faq-title">よくいただく質問</h2>
              <p>
                初めてのご相談でよくいただく質問をまとめています。
              </p>
            </div>
            <div className="faq-list">
              {faqs.map((faq, index) => (
                <details key={faq.question}>
                  <summary>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    {faq.question}
                    <i aria-hidden="true" />
                  </summary>
                  <p>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <ClosingInvite headingId="process-invite-title" />
      </main>
      <SiteFooter />
    </>
  );
}
