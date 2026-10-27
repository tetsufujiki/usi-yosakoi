import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ArchiveExplorer } from "@/components/ArchiveExplorer";
import { ClosingInvite } from "@/components/ClosingInvite";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  yosakoiArchiveStats,
  yosakoiWorks,
} from "@/data/yosakoi-works";
import {
  buildArchiveTeams,
  formatYearRange,
  getYearSummaries,
  presentWorks,
} from "@/lib/archive";

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

const teams = buildArchiveTeams(yosakoiWorks);
const presentedWorks = presentWorks(yosakoiWorks, teams);
const years = getYearSummaries(yosakoiWorks);

export default async function ArchivePage() {
  // Render per request so a shared ?team= / ?view=years URL is server-rendered
  // in the same state the explorer restores on the client.
  await connection();

  return (
    <>
      <SiteHeader tone="light" current="archive" />
      <main id="main-content">
        <section className="archive-head" aria-labelledby="archive-title">
          <div className="frame archive-head__inner">
            <div>
              <p className="eyebrow">作品アーカイブ</p>
              <h1 id="archive-title" className="archive-head__title">
                <span>音に残る、</span>
                <span>それぞれの演舞。</span>
              </h1>
            </div>
            <div className="archive-head__summary">
              <p>
                UNITED STUDIOが制作したよさこい演舞楽曲を、チームから、年度から、たどれます。
              </p>
              <dl>
                <div>
                  <dt>年度</dt>
                  <dd>
                    {formatYearRange(
                      yosakoiArchiveStats.oldestYear,
                      yosakoiArchiveStats.newestYear,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>チーム</dt>
                  <dd>{teams.length}</dd>
                </div>
                <div>
                  <dt>作品</dt>
                  <dd>{yosakoiArchiveStats.workCount}</dd>
                </div>
              </dl>
            </div>
          </div>
          <div className="frame archive-head__note">
            <p>
              その年の演舞を撮影していただいたYouTube映像の中から、音声が聞き取りやすいものを使用させていただいております。
            </p>
            <p>
              撮影してくださったカメラマンの皆さま、いつも本当にありがとうございます。
            </p>
          </div>
        </section>

        <section className="archive-body" aria-label="作品をたどる">
          <div className="frame">
            <Suspense fallback={null}>
              <ArchiveExplorer
                works={presentedWorks}
                teams={teams}
                years={years}
              />
            </Suspense>
          </div>
        </section>

        <ClosingInvite headingId="archive-invite-title" showProcessLink />
      </main>
      <SiteFooter />
    </>
  );
}
