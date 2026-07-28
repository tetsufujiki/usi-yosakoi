import type { Metadata } from "next";
import Link from "next/link";
import { ArchiveExplorer } from "@/components/ArchiveExplorer";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { yosakoiWorks } from "@/data/yosakoi-works";

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
  const years = yosakoiWorks.flatMap((work) => work.years);
  const oldestYear = Math.min(...years);
  const newestYear = Math.max(...years);

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
              <h1 id="archive-hero-title">
                音に残る、
                <br />
                それぞれの演舞。
              </h1>
            </div>
            <div className="archive-hero__summary">
              <p>
                年度、チーム名、曲名から、
                <br />
                UNITED STUDIOのよさこい演舞楽曲を探せます。
              </p>
              <dl>
                <div>
                  <dt>PERIOD</dt>
                  <dd>
                    {oldestYear} — {newestYear}
                  </dd>
                </div>
                <div>
                  <dt>WORKS</dt>
                  <dd>{yosakoiWorks.length} SAMPLE</dd>
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
              <p>
                写真を必須にせず、チームと年度から生成したグラフィックで作品の個性を表現しています。
              </p>
            </div>

            <ArchiveExplorer works={yosakoiWorks} />
          </div>
        </section>

        <section
          className="archive-return section section--ink"
          aria-labelledby="archive-return-title"
        >
          <div className="frame archive-return__inner">
            <div>
              <p className="section-label">BEHIND THE MUSIC</p>
              <h2 id="archive-return-title">
                作品の先にある、
                <br />
                制作の考え方へ。
              </h2>
            </div>
            <div>
              <p>
                ヒアリング、構成設計、作編曲、収録、仕上げ。
                演舞のための一曲が完成するまでをご紹介しています。
              </p>
              <Link className="primary-link" href="/">
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
              <h2 id="archive-inquiry-title">次の演舞を、音から。</h2>
            </div>
            <div>
              <p>
                チームのテーマや演舞時期が決まっている場合は、わかる範囲でお知らせください。
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
