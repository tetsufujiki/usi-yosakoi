import type { Metadata } from "next";
import Link from "next/link";
import { SelectedWorks } from "@/components/SelectedWorks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { featuredWorks, yosakoiWorks } from "@/data/yosakoi-works";

export const metadata: Metadata = {
  title: {
    absolute: "よさこい演舞楽曲制作｜UNITED STUDIO INC",
  },
  description:
    "チームのテーマや演舞構成に合わせた、よさこいオリジナル楽曲を制作。作編曲、歌・楽器収録、ミックス、マスタリングまで一貫対応します。",
  alternates: {
    canonical: "/",
  },
};

const features = [
  {
    number: "01",
    title: "Theme Design",
    copy: "チームのテーマや演舞構成をもとに、楽曲全体の流れを設計します。",
  },
  {
    number: "02",
    title: "Composition & Arrangement",
    copy: "和の要素、現代的なサウンド、歌、掛け声を組み合わせ、一曲として構成します。",
  },
  {
    number: "03",
    title: "Recording",
    copy: "歌、掛け声、楽器収録など、必要な音を制作内容に合わせて収録します。",
  },
  {
    number: "04",
    title: "Mix & Mastering",
    copy: "演舞会場でも映えるよう、迫力と聴きやすさのバランスを整えます。",
  },
];

const process = [
  ["ヒアリング", "テーマ、演舞構成、希望する方向性を確認します。"],
  ["構成設計", "見せ場、展開、歌や掛け声の入り方を整理します。"],
  ["作編曲", "チームの個性に合わせて楽曲を制作します。"],
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

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero__phenomenon" aria-hidden="true">
            <div className="hero__formation">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="hero__surge" />
            <div className="hero__pulse hero__pulse--one" />
            <div className="hero__pulse hero__pulse--two" />
          </div>

          <div className="hero__inner">
            <div className="hero__copy">
              <p className="hero__eyebrow">
                <span>YOSAKOI MUSIC</span>
                <span>EST. 2008</span>
              </p>
              <h1 id="hero-title">
                よさこい演舞の
                <br />
                テーマと熱量を、
                <br />
                <em>記憶に残る音楽へ。</em>
              </h1>
              <p className="hero__lead">
                チームの物語、地域性、演舞構成に合わせて、
                <br />
                一曲の中に流れと見せ場を設計します。
              </p>
              <div className="hero__actions">
                <Link className="primary-link" href="/archive">
                  作品アーカイブを見る
                  <span aria-hidden="true">↗</span>
                </Link>
                <a className="secondary-link" href="#inquiry">
                  制作について相談する
                </a>
              </div>
            </div>

            <div className="hero__index" aria-hidden="true">
              <span>FORMATION</span>
              <span>FLOW</span>
              <span>BURST</span>
              <strong>音が、演舞を前へ進める。</strong>
            </div>
          </div>

          <a className="hero__scroll" href="#intro">
            <span>SCROLL</span>
            <i aria-hidden="true" />
          </a>
        </section>

        <section className="intro section" id="intro" aria-labelledby="intro-title">
          <div className="frame intro__grid">
            <div>
              <p className="section-label">ABOUT THE MUSIC</p>
              <h2 id="intro-title">
                演舞のための一曲を、
                <br />
                チームごとに設計する。
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
                  自分たちのチームなら、
                  <br />
                  どんな曲になるだろう。
                </strong>
              </div>
            </div>
          </div>
        </section>

        <section
          className="features section section--ink"
          aria-labelledby="features-title"
        >
          <div className="frame">
            <div className="section-heading section-heading--split">
              <div>
                <p className="section-label">WHAT WE DESIGN</p>
                <h2 id="features-title">制作の特徴</h2>
              </div>
              <p>
                音色を足すだけではなく、演舞の始まりから余韻までをひとつの構成として考えます。
              </p>
            </div>

            <div className="feature-grid">
              {features.map((feature) => (
                <article className="feature" key={feature.number}>
                  <span>{feature.number}</span>
                  <h3>{feature.title}</h3>
                  <p>{feature.copy}</p>
                  <i aria-hidden="true" />
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="process section" aria-labelledby="process-title">
          <div className="frame">
            <div className="section-heading">
              <p className="section-label">FROM DIALOGUE TO PERFORMANCE</p>
              <h2 id="process-title">
                一つの対話から、
                <br />
                演舞を動かす音へ。
              </h2>
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
          className="selected section section--warm"
          aria-labelledby="selected-title"
        >
          <div className="frame">
            <div className="section-heading section-heading--split">
              <div>
                <p className="section-label">SELECTED WORKS</p>
                <h2 id="selected-title">音楽が、隊列をひとつにする。</h2>
              </div>
              <p>
                作品を選んだときだけ、YouTube動画を1件読み込みます。
                初期表示では外部プレイヤーを読み込みません。
              </p>
            </div>
            <SelectedWorks works={featuredWorks} />
          </div>
        </section>

        <section className="archive-invitation section" aria-labelledby="archive-title">
          <div className="archive-invitation__phenomenon" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="frame archive-invitation__inner">
            <div>
              <p className="section-label">WORK ARCHIVE</p>
              <p className="archive-invitation__count">
                <strong>{yosakoiWorks.length}</strong>
                <span>sample works</span>
              </p>
            </div>
            <div>
              <h2 id="archive-title">
                年、チーム、曲名から、
                <br />
                演舞楽曲を探す。
              </h2>
              <p>
                現在は初期確認用のサンプルデータです。
                次フェーズで既存104作品を整理して移行します。
              </p>
              <Link className="primary-link primary-link--dark" href="/archive">
                アーカイブを開く
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section className="faq section" aria-labelledby="faq-title">
          <div className="frame faq__grid">
            <div className="section-heading">
              <p className="section-label">FAQ</p>
              <h2 id="faq-title">制作について</h2>
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

        <section
          className="inquiry section section--accent"
          id="inquiry"
          aria-labelledby="inquiry-title"
        >
          <div className="frame inquiry__inner">
            <div>
              <p className="section-label">START A CONVERSATION</p>
              <h2 id="inquiry-title">
                よさこい楽曲制作の
                <br />
                ご相談
              </h2>
            </div>
            <div>
              <p>
                チームのテーマ、演舞時期、制作したい内容が決まっている場合は、わかる範囲でお知らせください。
              </p>
              <a
                className="inquiry__mail"
                href="mailto:info@united-studio.com"
              >
                info@united-studio.com
                <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
