import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveExplorer } from "@/components/ArchiveExplorer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  yosakoiArchiveStats,
  yosakoiWorks,
} from "@/data/yosakoi-works";

export const metadata: Metadata = {
  title: "よさこい楽曲制作実績・演舞作品アーカイブ",
  description:
    "UNITED STUDIOが手がけたよさこい演舞楽曲を、年度・チーム名・曲名から検索できる作品アーカイブです。",
  alternates: {
    canonical: "/archive",
  },
  openGraph: {
    title: "よさこい楽曲制作実績・演舞作品アーカイブ",
    description:
      "UNITED STUDIOが手がけたよさこい演舞楽曲を、年度・チーム名・曲名から検索できます。",
    url: "/archive",
    images: [
      {
        url: "/og-yosakoi.png",
        width: 1200,
        height: 630,
        alt: "UNITED STUDIO / YOSAKOI 作品アーカイブ",
      },
    ],
  },
};

export default function ArchivePage() {
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="archive-hero" aria-labelledby="archive-hero-title">
          <div className="archive-hero__pattern" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
          <div className="frame archive-hero__inner">
            <div>
              <p className="section-label">YOSAKOI WORK ARCHIVE</p>
              <h1 id="archive-hero-title" className="archive-hero__title">
                <span>音に残る、</span>
                <span>それぞれの</span>
                <span>演舞。</span>
              </h1>
            </div>
            <div className="archive-hero__summary">
              <p className="archive-hero__description">
                <span>年度、チーム名、曲名から、</span>
                <br className="archive-hero__description-break--mobile" />
                <span>UNITED STUDIOの</span>
                <br />
                <span>よさこい演舞楽曲を探せます。</span>
              </p>
              <dl>
                <div>
                  <dt>PERIOD</dt>
                  <dd>
                    {yosakoiArchiveStats.oldestYear} —{" "}
                    {yosakoiArchiveStats.newestYear}
                  </dd>
                </div>
                <div>
                  <dt>WORKS</dt>
                  <dd>{yosakoiArchiveStats.workCount} WORKS</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="archive-section section" aria-labelledby="archive-list-title">
          <div className="frame">
            <div className="archive-section__heading">
              <div>
                <p className="section-label">FIND A PERFORMANCE</p>
                <h2 id="archive-list-title">作品を探す</h2>
              </div>
              <div className="archive-section__note">
                <p>
                  その年の演舞を撮影していただいたYouTube映像の中から、
                  音声が聞き取りやすいものを使用させていただいております。
                </p>
                <p>
                  撮影してくださったカメラマンの皆さま、
                  いつも本当にありがとうございます。
                </p>
              </div>
            </div>

            <ArchiveExplorer works={yosakoiWorks} />
          </div>
        </section>

        <section className="archive-return section" aria-labelledby="archive-return-title">
          <div className="frame archive-return__inner">
            <div>
              <p className="section-label">BEHIND THE MUSIC</p>
              <h2 id="archive-return-title">
                <span className="archive-return__title-line">作品を支える、</span>
                <span className="archive-return__title-line">
                  音づくりの考え方。
                </span>
              </h2>
            </div>
            <div>
              <p>
                ヒアリング、響きの探索、作編曲、収録、仕上げ。
                演舞のための一曲が完成するまでをご紹介しています。
              </p>
              <Link className="primary-link primary-link--sun" href="/">
                楽曲制作について
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <section
          className="inquiry section section--accent"
          id="inquiry"
          aria-labelledby="archive-inquiry-title"
        >
          <div className="frame inquiry__inner">
            <div>
              <p className="section-label">START A CONVERSATION</p>
              <h2 id="archive-inquiry-title" className="archive-inquiry__title">
                <span>次の演舞を、</span><span>音から。</span>
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
      <SiteFooter />
    </>
  );
}
