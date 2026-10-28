import type { YosakoiWork } from "@/data/yosakoi-works";
import { type ArchiveTeam, getTeamHref } from "@/lib/archive";
import { TeamTile } from "../TeamTile";

type HomeHeroProps = {
  recentRecords: Array<{ team: ArchiveTeam; work: YosakoiWork }>;
};

export function HomeHero({ recentRecords }: HomeHeroProps) {
  return (
    <section className="home-hero" aria-labelledby="hero-title">
      <div className="home-hero__band" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className="frame home-hero__inner">
        <div className="home-hero__copy">
          <p className="eyebrow">UNITED STUDIO｜よさこい演舞楽曲の記録</p>
          <h1 id="hero-title" className="home-hero__title">
            <span>そのチームにしか、</span>
            <span>鳴らせない音がある。</span>
          </h1>
          <p className="home-hero__lead">
            チームと重ねた時間を、演舞と音楽の記録から。
          </p>
          <div className="home-hero__actions">
            <a className="ink-link" href="#teams">
              チームから作品をたどる
              <span aria-hidden="true">↓</span>
            </a>
            <a className="quiet-link" href="#kokushi">
              國士舞双との歩み
            </a>
          </div>
        </div>

        <div className="home-hero__records" aria-labelledby="recent-records-title">
          <div className="home-hero__records-head">
            <h2 id="recent-records-title">最近の作品から</h2>
            <a href="#teams">すべてのチーム</a>
          </div>
          <ul className="recent-grid">
            {recentRecords.map(({ team, work }, index) => (
              <li key={team.id}>
                <TeamTile
                  team={team}
                  href={getTeamHref(team.id)}
                  latestWork={work}
                  detail="latest"
                  priority={index < 6}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
