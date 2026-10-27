import type { Metadata } from "next";
import { ClosingInvite } from "@/components/ClosingInvite";
import { ApproachSection } from "@/components/home/ApproachSection";
import { HomeHero } from "@/components/home/HomeHero";
import { KokushiChapter } from "@/components/home/KokushiChapter";
import { MovementBridge } from "@/components/home/MovementBridge";
import { TeamIndexSection } from "@/components/home/TeamIndexSection";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import {
  featuredWorks,
  yosakoiArchiveStats,
  yosakoiWorks,
} from "@/data/yosakoi-works";
import {
  buildArchiveTeams,
  getYearSummaries,
  presentWorks,
} from "@/lib/archive";
import { siteDescription, siteIconUrl, siteTitle, siteUrl } from "@/lib/site";
import { sortWorksNewestFirst } from "@/lib/yosakoi";

export const metadata: Metadata = {
  title: {
    absolute: "よさこい演舞楽曲制作｜UNITED STUDIO INC",
  },
  description: siteDescription,
  alternates: {
    canonical: siteUrl,
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "UNITED STUDIO INC",
      url: siteUrl,
      logo: siteIconUrl,
      sameAs: ["https://united-studio.com"],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteTitle,
      url: siteUrl,
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
    {
      "@type": "Service",
      "@id": `${siteUrl}/#service`,
      name: "よさこい演舞楽曲制作",
      description: siteDescription,
      provider: {
        "@id": `${siteUrl}/#organization`,
      },
      areaServed: {
        "@type": "Country",
        name: "日本",
      },
      serviceType: "よさこい楽曲制作",
    },
  ],
};

const kokushiTeamId = "kokushi";
const recentRecordCount = 6;

/** Existing 國士舞双 selection and its display titles from the previous top page. */
const journeyWorkSelections = [
  { id: "work-120774", displayTitle: "暁-AKATSUKI-" },
  { id: "work-120605", displayTitle: "はりまや橋で会いましょう" },
  { id: "work-120108", displayTitle: "感謝感激雨あられ" },
  { id: "work-119656", displayTitle: "土佐より" },
] as const;

const hotaeruYoutubeId = "RQyDJsJmaIg";

const teams = buildArchiveTeams(yosakoiWorks);
const presentedWorks = presentWorks(yosakoiWorks, teams);
const worksById = new Map(yosakoiWorks.map((work) => [work.id, work]));
const presentedById = new Map(presentedWorks.map((work) => [work.id, work]));

function requireWork<T>(map: Map<string, T>, id: string, label: string) {
  const work = map.get(id);
  if (!work) throw new Error(`${label} work "${id}" was not found.`);
  return work;
}

function requireTeam(teamId: string) {
  const team = teams.find((candidate) => candidate.id === teamId);
  if (!team) throw new Error(`Team "${teamId}" was not found.`);
  return team;
}

const kokushiTeam = requireTeam(kokushiTeamId);

const kokushiWorks = sortWorksNewestFirst(
  yosakoiWorks.filter((work) => work.teamId === kokushiTeamId),
);

const journeyWorks = journeyWorkSelections.map(({ id, displayTitle }) => ({
  ...requireWork(presentedById, id, "國士舞双 selected"),
  workTitle: displayTitle,
}));

const hotaeruWork = requireWork(
  new Map(yosakoiWorks.map((work) => [work.youtubeId ?? work.id, work])),
  hotaeruYoutubeId,
  "HOTAERU",
);

const recentRecords = teams
  .filter((team) => team.mark)
  .map((team) => ({
    team,
    work: requireWork(worksById, team.latestWorkId, "Latest"),
  }))
  .sort((a, b) => b.team.newestYear - a.team.newestYear)
  .slice(0, recentRecordCount);

const listeningWorks = presentWorks(
  featuredWorks.filter((work) => work.teamId !== kokushiTeamId),
  teams,
);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader tone="light" current="home" />
      <main id="main-content">
        <HomeHero recentRecords={recentRecords} />
        <TeamIndexSection
          teams={teams}
          worksById={worksById}
          years={getYearSummaries(yosakoiWorks)}
          workCount={yosakoiArchiveStats.workCount}
          oldestYear={yosakoiArchiveStats.oldestYear}
          newestYear={yosakoiArchiveStats.newestYear}
          listeningWorks={listeningWorks}
        />
        <MovementBridge />
        <KokushiChapter
          team={kokushiTeam}
          works={kokushiWorks}
          selectedWorks={journeyWorks}
          film={hotaeruWork}
        />
        <ApproachSection />
        <ClosingInvite />
      </main>
      <SiteFooter />
    </>
  );
}
