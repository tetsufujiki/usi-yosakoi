import type { StageArchive } from "@/lib/year-archive";

type ArchiveIntroProps = {
  archive: StageArchive;
  /** "hero" makes the archive the page's opening (h1). */
  as?: "hero" | "section";
  titleId: string;
};

export function ArchiveIntro({ archive, as = "section", titleId }: ArchiveIntroProps) {
  const Title = as === "hero" ? "h1" : "h2";

  return (
    <div className={`v2-intro v2-intro--${as}`}>
      <div className="v2-intro__copy">
        <Title id={titleId} className="v2-intro__title">
          {as === "hero" ? (
            <>
              <span>よさこい演舞楽曲</span>
              <span>作品アーカイブ</span>
            </>
          ) : (
            "作品アーカイブ"
          )}
        </Title>
        <p className="v2-intro__lead">
          UNITED STUDIO INC が制作した演舞楽曲を年度ごとに。
          <br className="v2-intro__break" />
          カードを選ぶと、その場で再生します。
        </p>
      </div>
      <dl className="v2-intro__stats">
        <div>
          <dt>年度</dt>
          <dd>
            {archive.oldestYear}–{archive.newestYear}
          </dd>
        </div>
        <div>
          <dt>作品</dt>
          <dd>{archive.workCount}</dd>
        </div>
        <div>
          <dt>チーム</dt>
          <dd>{archive.teamCount}</dd>
        </div>
      </dl>
    </div>
  );
}
