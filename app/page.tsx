import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SelectedWorks } from "@/components/SelectedWorks";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { YosakoiHeroKinetics } from "@/components/YosakoiHeroKinetics";
import { yosakoiWorks } from "@/data/yosakoi-works";

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

const journeyWorkSelections = [
  { id: "work-120774", displayTitle: "暁-AKATSUKI-" },
  { id: "work-120605", displayTitle: "はりまや橋で会いましょう" },
  { id: "work-119035", displayTitle: "HOTAERU" },
  { id: "work-119656", displayTitle: "土佐より" },
] as const;

const journeyWorks = journeyWorkSelections.map(({ id, displayTitle }) => {
  const work = yosakoiWorks.find((candidate) => candidate.id === id);

  if (!work) {
    throw new Error(`OUR JOURNEY work "${id}" was not found.`);
  }

  return {
    ...work,
    workTitle: displayTitle,
  };
});

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
            <YosakoiHeroKinetics variant="hero" />
            <div className="hero__formation">
              <span />
              <span />
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>

          <div className="hero__inner">
            <div className="hero__copy">
              <p className="hero__eyebrow">
                <span>YOSAKOI SOUND WORKS</span>
                <span>EST. 2008</span>
              </p>
              <h1 id="hero-title">
                <span className="hero__title-line">チームの想いを、</span>
                <span className="hero__title-line">その熱量を、</span>
                <em className="hero__title-line hero__title-line--final">
                  <span>記憶に残る</span>
                  <span>音楽へ。</span>
                </em>
              </h1>
              <p className="hero__subcopy">
                その一曲が、忘れられない景色を生む。
              </p>
              <div className="hero__actions">
                <Link className="primary-link" href="/archive">
                  作品アーカイブを見る
                  <span aria-hidden="true">↗</span>
                </Link>
                <Link className="secondary-link" href="/contact">
                  制作について相談する
                </Link>
              </div>
            </div>

            <div className="hero__aside" aria-hidden="true">
              <div className="hero__index">
                <span>FORMATION</span>
                <span>FLOW</span>
                <span>BURST</span>
              </div>
              <p className="hero__poem">
                <span>heat gathers,</span>
                <span>a current turns,</span>
                <span>and the scene opens</span>
              </p>
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

        <section className="journey section section--warm" aria-labelledby="journey-title">
          <div className="frame">
            <div className="journey__intro">
              <div className="journey__heading">
                <div>
                  <p className="section-label">OUR JOURNEY</p>
                  <h2 id="journey-title">
                    <span>國士舞双</span>
                    <span>と、音楽を</span>
                    <span>重ねて</span>
                  </h2>
                  <p className="journey__meta">國士舞双 : 高知県・東京都</p>
                </div>
                <figure className="journey__visual">
                  <Image
                    src="/images/yosakoi/kokushimusou-journey.webp"
                    alt="國士舞双の演舞風景"
                    fill
                    sizes="(min-width: 820px) 55vw, calc(100vw - 40px)"
                  />
                </figure>
              </div>
            </div>

            <div className="journey__works">
              <div className="journey__works-heading">
                <p className="section-label">SELECTED CHAPTERS</p>
                <span>2008—</span>
              </div>
              <SelectedWorks works={journeyWorks} />
            </div>

            <div className="journey__story">
              <p className="journey__lead">
                よさこい祭りと関わり始めたのは、2008年のことです。
              </p>
              <p>
                きっかけは、高知と関東の合同チーム「國士舞双」を立ち上げられた、やんちゃ本舗様との出会いでした。「この国に二つと無いものを」というチームコンセプトを伺い、それならばと、毎年知恵をしぼりながら音楽をつくり続けること5年。2012年、高知よさこい祭り全国大会・後夜祭における「武政英策賞※」の受賞は、それまで重ねてきた一つひとつが、最高の結果となって表れた瞬間でした。
              </p>
              <p>
                よさこい工房祭彩様とのタッグも年を重ねるごとに深まり、音楽と演舞を含めた作品全体の完成度も、より高いものへと育ってきました。
              </p>
              <p>
                そして國士舞双は、2026年に結成20周年を迎えました。これから先も、高知よさこい界の風雲児として突き進んでいくその歩みを、音楽で支え続けられることを楽しみにしています。
              </p>
              <p className="journey__closing">
                よさこいは、その地域を彩る「お祭り」です。毎年訪れる熱い夏と、全国各地で出会う皆さまの笑顔を楽しみに、これからも制作を重ねてまいります。
              </p>
              <p className="journey__footnote">
                ※高知よさこい祭り本祭の入賞チームの中から、毎年1チームのみが選ばれる栄誉賞
              </p>
            </div>
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
                <span>WORKS</span>
              </p>
            </div>
            <div>
              <h2 id="archive-title">
                <span className="archive-invitation__title-line">
                  年度、チーム、
                </span>
                <span className="archive-invitation__title-line">曲名から、</span>
                <span className="archive-invitation__title-line">
                  演舞楽曲を探す。
                </span>
              </h2>
              <p>
                2008年から現在までの制作実績を、年度・チーム・曲名から探せます。
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
                <span className="inquiry__title-line">よさこい楽曲</span>
                <span className="inquiry__title-line">制作のご相談</span>
              </h2>
            </div>
            <div>
              <Link className="inquiry__mail" href="/contact">
                制作希望の内容を送る
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter kineticsVariant="finale" />
    </>
  );
}
