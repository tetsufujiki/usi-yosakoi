"use client";

import Image from "next/image";
import { TeamMark } from "@/components/TeamMark";
import { PerformanceCard } from "@/components/studio/PerformanceCard";
import { usePlayer } from "@/components/v2/PlayerProvider";
import { StudioJourneyFilm } from "@/components/studio/StudioJourneyFilm";
import { browseStudioArchive } from "@/lib/studio-navigation";
import type { StageWork } from "@/lib/year-archive";

export function StudioJourney({ film, selected, works }: { film: StageWork; selected: StageWork[]; works: StageWork[] }) {
  const { open } = usePlayer();
  const awardWork = works.find((work) => work.years.includes(2012) && work.workTitle?.includes("大盤振"));
  const anniversary = works.find((work) => work.years.includes(2026) && work.workTitle === "宝船");
  const queue = works.filter((work) => work.youtubeId).map((work) => work.id);
  const oldest = Math.min(...works.flatMap((work) => work.years));
  const newest = Math.max(...works.flatMap((work) => work.years));
  return <section id="kokushi" className="studio-journey" aria-labelledby="studio-journey-title">
    <div className="studio-journey__opening">
      <div className="studio-section-kicker"><span>チームとの歩み</span><span aria-hidden="true">01</span></div>
      <div className="studio-journey__heading"><h2 id="studio-journey-title">國士舞双と、<br />音楽を重ねて。</h2><div>{film.mark ? <TeamMark mark={film.mark} tone="white" size={130} /> : null}<p>{oldest}—{newest}<span>{works.length}作品の記録</span></p></div></div>
      <StudioJourneyFilm film={film} queueIds={queue} />
      <div className="studio-journey__film-caption"><div><span>{film.yearLabel}</span><h3>{film.workTitle}</h3></div><p>國士舞双／よさこい鳴子踊り特別演舞</p></div>
    </div>

    <div className="studio-journey__story">
      <figure className="studio-journey__photo"><Image src="/images/yosakoi/kokushimusou-journey.webp" alt="提灯を掲げる踊り子と國士舞双の演舞風景" width={640} height={640} sizes="(min-width: 900px) 38vw, 100vw" /><figcaption>國士舞双／高知県・東京都</figcaption></figure>
      <div className="studio-journey__reading">
        <p className="studio-section-label">國士舞双のチームコンセプト</p>
        <blockquote>「この国に<br />二つと無いものを。」</blockquote>
        <p>2008年、やんちゃ本舗様との出会いから、國士舞双の楽曲制作が始まりました。そのチームの想いを受け、毎年、知恵をしぼりながら音楽を重ねてきました。</p>
        <p>よさこい工房祭彩様との協働も年を重ねるごとに深まり、音楽と演舞を含めた作品全体を、ともにつくり上げています。</p>
        <ol className="studio-journey__milestones">
          <li><span>2008</span><p>USIとの出会い、楽曲制作の始まり</p></li>
          <li id="kokushi-award"><span>2012</span><div className="studio-anniversary"><p>高知よさこい祭り全国大会・後夜祭<br />武政英策賞を受賞</p>{awardWork?.youtubeId ? <button className="studio-anniversary__film" type="button" aria-label="2012年 國士舞双「大盤振舞！よさこいねずみ小僧」の演舞映像を再生" aria-haspopup="dialog" onClick={(event) => open(awardWork.id, event.currentTarget, queue)}><span><Image src={`https://i.ytimg.com/vi/${awardWork.youtubeId}/mqdefault.jpg`} alt="國士舞双「大盤振舞！よさこいねずみ小僧」の演舞映像" width={320} height={180} sizes="144px" unoptimized /><i aria-hidden="true">▶</i></span><span>2012『大盤振舞！よさこいねずみ小僧』</span></button> : null}</div></li>
          <li id="kokushi-anniversary"><span>2026</span><div className="studio-anniversary"><p>國士舞双、結成20周年を迎える</p>{anniversary?.youtubeId ? <button className="studio-anniversary__film" type="button" aria-label="2026年 國士舞双「宝船」の演舞映像を再生" aria-haspopup="dialog" onClick={(event) => open(anniversary.id, event.currentTarget, queue)}><span><Image src={`https://i.ytimg.com/vi/${anniversary.youtubeId}/mqdefault.jpg`} alt="國士舞双「宝船」の演舞映像" width={320} height={180} sizes="144px" unoptimized /><i aria-hidden="true">▶</i></span><span>2026『宝船』</span></button> : null}</div></li>
        </ol>
        <details className="studio-story-details"><summary>出会いからの歩みを読む<span aria-hidden="true">＋</span></summary>
          <p>よさこい祭りと関わり始めたのは、2008年のことです。</p>
          <p>きっかけは、高知と関東の合同チーム「國士舞双」を立ち上げられた、やんちゃ本舗様との出会いでした。「この国に二つと無いものを」というチームコンセプトを伺い、それならばと、毎年知恵をしぼりながら音楽をつくり続けること5年。2012年、高知よさこい祭り全国大会・後夜祭における「武政英策賞※」の受賞は、それまで重ねてきた一つひとつが、最高の結果となって表れた瞬間でした。</p>
          <p>よさこい工房祭彩様とのタッグも年を重ねるごとに深まり、音楽と演舞を含めた作品全体の完成度も、より高いものへと育ってきました。</p>
          <p>そして國士舞双は、2026年に結成20周年を迎えました。これから先も、高知よさこい界の風雲児として突き進んでいくその歩みを、音楽で支え続けられることを楽しみにしています。</p>
          <p>よさこいは、その地域を彩る「お祭り」です。毎年訪れる熱い夏と、全国各地で出会う皆さまの笑顔を楽しみに、これからも制作を重ねてまいります。</p>
          <p className="studio-note">※高知よさこい祭り本祭の入賞チームの中から、毎年1チームのみが選ばれる栄誉賞。</p>
        </details>
      </div>
    </div>
    <div id="kokushi-films" className="studio-journey__works"><h3>演舞映像でたどる、4作品</h3><ul className="performance-grid" aria-label="國士舞双の演舞映像">{selected.map((work) => <li key={work.id}><PerformanceCard work={work} queueIds={queue} /></li>)}</ul></div>
    <div className="studio-journey__return"><button type="button" onClick={() => browseStudioArchive("kokushi")}>國士舞双の全{works.length}作品を聴く <span aria-hidden="true">↑</span></button><button type="button" onClick={() => browseStudioArchive()}>ほかのチームの作品へ <span aria-hidden="true">↑</span></button></div>
  </section>;
}
