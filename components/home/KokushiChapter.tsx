import Image from "next/image";
import Link from "next/link";
import type { YosakoiWork } from "@/data/yosakoi-works";
import {
  type ArchiveTeam,
  formatYearRange,
  getTeamHref,
  type PresentedWork,
} from "@/lib/archive";
import { formatYears } from "@/lib/yosakoi";
import { HotaeruFilm } from "../HotaeruFilm";
import { Reveal } from "../Reveal";
import { SelectedWorks } from "../SelectedWorks";
import { TeamMark } from "../TeamMark";

type KokushiChapterProps = {
  team: ArchiveTeam;
  works: YosakoiWork[];
  selectedWorks: PresentedWork[];
  film: YosakoiWork;
};

function findTitleForYear(works: YosakoiWork[], year: number) {
  return works.find((work) => work.years.includes(year))?.workTitle;
}

export function KokushiChapter({
  team,
  works,
  selectedWorks,
  film,
}: KokushiChapterProps) {
  const firstYearTitle = findTitleForYear(works, 2008);
  const anniversaryYearTitle = findTitleForYear(works, 2026);

  const timeline = [
    {
      when: "2008",
      title: "出会い",
      body: "高知と関東の合同チーム「國士舞双」を立ち上げられた、やんちゃ本舗様との出会いから、楽曲制作が始まりました。",
      work: firstYearTitle,
    },
    {
      when: "2008–2012",
      title: "毎年、知恵をしぼって",
      body: "「この国に二つと無いものを」というチームのコンセプトを受けて、音楽をつくり続けた5年間。",
    },
    {
      when: "2012",
      title: "武政英策賞",
      body: "高知よさこい祭り全国大会・後夜祭にて「武政英策賞※」を受賞。",
    },
    {
      when: "年を重ねて",
      title: "よさこい工房祭彩様とのタッグ",
      body: "協働が深まるごとに、音楽と演舞を含めた作品全体の完成度が育ってきました。",
    },
    {
      when: "2026",
      title: "結成20周年",
      body: "國士舞双は、2026年に結成20周年を迎えました。",
      work: anniversaryYearTitle,
    },
  ];

  return (
    <section className="kokushi" id="kokushi" aria-labelledby="kokushi-title">
      <Reveal className="frame kokushi__opener">
        <figure className="kokushi__photo">
          <Image
            src="/images/yosakoi/kokushimusou-journey.webp"
            alt="國士舞双の演舞風景"
            fill
            sizes="(min-width: 1040px) 560px, (min-width: 640px) 50vw, calc(100vw - 40px)"
          />
        </figure>

        <div className="kokushi__title-block">
          {team.mark ? (
            <div className="kokushi__mark">
              <TeamMark mark={team.mark} size={240} alt="國士舞双のチームマーク" />
            </div>
          ) : null}
          <p className="eyebrow">チームとの歩み</p>
          <h2 id="kokushi-title" className="kokushi__title">
            <span>國士舞双</span>
            <span>と、音楽を</span>
            <span>重ねて</span>
          </h2>
          <p className="kokushi__meta">國士舞双 : 高知県・東京都</p>
          <dl className="kokushi__facts">
            <div>
              <dt>作品の記録</dt>
              <dd>{formatYearRange(team.oldestYear, team.newestYear)}</dd>
            </div>
            <div>
              <dt>アーカイブ収録</dt>
              <dd>{team.workCount}作品</dd>
            </div>
          </dl>
        </div>
      </Reveal>

      <div className="frame kokushi__chronicle">
        <div className="kokushi-timeline">
          <h3>歩みの年譜</h3>
          <ol>
            {timeline.map((item) => (
              <li key={item.when}>
                <span className="kokushi-timeline__when">{item.when}</span>
                <div>
                  <p className="kokushi-timeline__title">{item.title}</p>
                  <p>{item.body}</p>
                  {item.work ? (
                    <p className="kokushi-timeline__work">
                      この年の作品「{item.work}」
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
          <p className="kokushi__footnote">
            ※高知よさこい祭り本祭の入賞チームの中から、毎年1チームのみが選ばれる栄誉賞
          </p>
        </div>

        <article className="kokushi-story" aria-labelledby="kokushi-story-title">
          <h3 id="kokushi-story-title" className="kokushi-story__lead">
            <span>よさこい祭りと関わり始めたのは、</span>
            <span>2008年のことです。</span>
          </h3>
          <p>
            きっかけは、高知と関東の合同チーム「國士舞双」を立ち上げられた、やんちゃ本舗様との出会いでした。「この国に二つと無いものを」というチームコンセプトを伺い、それならばと、毎年知恵をしぼりながら音楽をつくり続けること5年。2012年、高知よさこい祭り全国大会・後夜祭における「武政英策賞※」の受賞は、それまで重ねてきた一つひとつが、最高の結果となって表れた瞬間でした。
          </p>
          <p>
            よさこい工房祭彩様とのタッグも年を重ねるごとに深まり、音楽と演舞を含めた作品全体の完成度も、より高いものへと育ってきました。
          </p>
          <p>
            そして國士舞双は、2026年に結成20周年を迎えました。これから先も、高知よさこい界の風雲児として突き進んでいくその歩みを、音楽で支え続けられることを楽しみにしています。
          </p>
        </article>
      </div>

      <div className="frame kokushi-works">
        <div className="kokushi-works__head">
          <h3>年度と曲名でたどる、紹介作品</h3>
          <p>選ぶと、このページの中で再生します。</p>
        </div>
        <SelectedWorks works={selectedWorks} />
      </div>

      <div className="kokushi__film">
        <HotaeruFilm
          youtubeId={film.youtubeId ?? ""}
          title="國士舞双「HOTAERU」"
          caption="よさこい鳴子踊り特別演舞"
        />
        <p className="kokushi__film-note frame">
          作品アーカイブでは、{formatYears(film.years)}年「{film.workTitle}」として収録しています。
        </p>
      </div>

      <div className="frame kokushi__epilogue">
        <p className="kokushi__closing">
          よさこいは、その地域を彩る「お祭り」です。毎年訪れる熱い夏と、全国各地で出会う皆さまの笑顔を楽しみに、これからも制作を重ねてまいります。
        </p>

        <nav className="kokushi__next" aria-label="國士舞双の章のあとに">
          <Link className="kokushi__next-link" href={getTeamHref(team.id)}>
            <small>國士舞双の全{team.workCount}作品</small>
            <span>
              {formatYearRange(team.oldestYear, team.newestYear)}の作品をすべて見る
            </span>
            <i aria-hidden="true">→</i>
          </Link>
          <Link className="kokushi__next-link" href="/archive">
            <small>ほかのチームの作品</small>
            <span>チームから作品をたどる</span>
            <i aria-hidden="true">→</i>
          </Link>
        </nav>
      </div>
    </section>
  );
}
