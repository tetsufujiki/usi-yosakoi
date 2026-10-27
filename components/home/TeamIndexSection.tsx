import Link from "next/link";
import type { YosakoiWork } from "@/data/yosakoi-works";
import {
  type ArchiveTeam,
  getTeamHref,
  getYearHref,
  type PresentedWork,
  type YearSummary,
} from "@/lib/archive";
import { SelectedWorks } from "../SelectedWorks";
import { TeamTile } from "../TeamTile";

type TeamIndexSectionProps = {
  teams: ArchiveTeam[];
  worksById: Map<string, YosakoiWork>;
  years: YearSummary[];
  workCount: number;
  oldestYear: number;
  newestYear: number;
  listeningWorks: PresentedWork[];
};

export function TeamIndexSection({
  teams,
  worksById,
  years,
  workCount,
  oldestYear,
  newestYear,
  listeningWorks,
}: TeamIndexSectionProps) {
  return (
    <section className="team-index section" id="teams" aria-labelledby="teams-title">
      <div className="frame">
        <header className="team-index__head">
          <div>
            <p className="eyebrow">作品アーカイブ</p>
            <h2 id="teams-title">
              <span>チームから、</span>
              <span>作品をたどる。</span>
            </h2>
          </div>
          <p>
            {oldestYear}年から{newestYear}年まで、{teams.length}チームと重ねた
            {workCount}作品の記録です。マークか名前を選ぶと、そのチームの歴代作品へ進めます。
          </p>
        </header>

        <ul className="team-index-grid">
          {teams.map((team) => (
            <li key={team.id}>
              <TeamTile
                team={team}
                href={getTeamHref(team.id)}
                latestWork={worksById.get(team.latestWorkId)}
              />
            </li>
          ))}
        </ul>

        <div className="team-index__years">
          <div className="team-index__years-head">
            <h3>年度からたどる</h3>
            <Link className="ink-link" href="/archive">
              全{workCount}作品のアーカイブへ
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <ol className="year-strip">
            {years.map((item) => (
              <li key={item.year}>
                <Link href={getYearHref(item.year)}>
                  <strong>{item.year}</strong>
                  <small>{item.count}作品</small>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        {listeningWorks.length ? (
          <div className="team-index__listen">
            <div className="team-index__listen-head">
              <h3>演舞の記録から、聴いてみる</h3>
              <p>サムネイルを選ぶと、このページの中で再生します。</p>
            </div>
            <SelectedWorks
              works={listeningWorks}
              showTeam
              className="selected-works--three"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
