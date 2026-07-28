"use client";

import { useEffect, useMemo, useState } from "react";
import type { YosakoiWork } from "@/data/yosakoi-works";
import { sortWorksNewestFirst } from "@/lib/yosakoi";
import { WorkCard } from "./WorkCard";

type ArchiveExplorerProps = {
  works: YosakoiWork[];
};

const desktopPageSize = 24;
const mobilePageSize = 12;

function normalize(value: string) {
  return value.normalize("NFKC").toLocaleLowerCase("ja");
}

export function ArchiveExplorer({ works }: ArchiveExplorerProps) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("");
  const [teamId, setTeamId] = useState("");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [pageSize, setPageSize] = useState(desktopPageSize);
  const [visibleCount, setVisibleCount] = useState(desktopPageSize);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 720px)");
    const updatePageSize = () => {
      const nextSize = media.matches ? mobilePageSize : desktopPageSize;
      setPageSize(nextSize);
      setVisibleCount(nextSize);
    };

    updatePageSize();
    media.addEventListener("change", updatePageSize);
    return () => media.removeEventListener("change", updatePageSize);
  }, []);

  const years = useMemo(
    () =>
      [...new Set(works.flatMap((work) => work.years))].sort(
        (a, b) => b - a,
      ),
    [works],
  );

  const teams = useMemo(
    () =>
      [...new Map(works.map((work) => [work.teamId, work.teamName]))]
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name, "ja")),
    [works],
  );

  const filteredWorks = useMemo(() => {
    const normalizedQuery = normalize(query.trim());

    return sortWorksNewestFirst(works).filter((work) => {
      const searchable = normalize(
        [work.teamName, work.workTitle, work.years.join(" ")].join(" "),
      );

      return (
        (!normalizedQuery || searchable.includes(normalizedQuery)) &&
        (!year || work.years.includes(Number(year))) &&
        (!teamId || work.teamId === teamId) &&
        (!featuredOnly || work.featured)
      );
    });
  }, [featuredOnly, query, teamId, works, year]);

  const visibleWorks = filteredWorks.slice(0, visibleCount);
  const hasFilters = Boolean(query || year || teamId || featuredOnly);

  function resetFilters() {
    setQuery("");
    setYear("");
    setTeamId("");
    setFeaturedOnly(false);
    setVisibleCount(pageSize);
  }

  function resetVisibleCount() {
    setVisibleCount(pageSize);
  }

  return (
    <div className="archive-explorer">
      <div className="archive-search">
        <label htmlFor="archive-query">チーム名・曲名・年度から検索</label>
        <div className="archive-search__field">
          <span aria-hidden="true">⌕</span>
          <input
            id="archive-query"
            type="search"
            value={query}
            placeholder="例：國士舞双、青き羅針盤、2025"
            onChange={(event) => {
              setQuery(event.target.value);
              resetVisibleCount();
            }}
          />
        </div>
      </div>

      <details className="archive-filters" open>
        <summary>
          絞り込み
          <span>{hasFilters ? "条件あり" : "すべて表示"}</span>
        </summary>
        <div className="archive-filters__controls">
          <label htmlFor="archive-year">
            <span>年度</span>
            <select
              id="archive-year"
              name="year"
              value={year}
              onChange={(event) => {
                setYear(event.target.value);
                resetVisibleCount();
              }}
            >
              <option value="">すべての年度</option>
              {years.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label htmlFor="archive-team">
            <span>チーム</span>
            <select
              id="archive-team"
              name="team"
              value={teamId}
              onChange={(event) => {
                setTeamId(event.target.value);
                resetVisibleCount();
              }}
            >
              <option value="">すべてのチーム</option>
              {teams.map((team) => (
                <option value={team.id} key={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </label>

          <label className="featured-filter">
            <input
              type="checkbox"
              checked={featuredOnly}
              onChange={(event) => {
                setFeaturedOnly(event.target.checked);
                resetVisibleCount();
              }}
            />
            <span className="featured-filter__mark" aria-hidden="true" />
            注目作品のみ
          </label>

          <button
            className="filter-reset"
            type="button"
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            条件をリセット
          </button>
        </div>
      </details>

      <div className="archive-status">
        <p aria-live="polite">
          <strong>{filteredWorks.length}</strong> 作品
        </p>
        <div className="filter-chips" aria-label="選択中の条件">
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                resetVisibleCount();
              }}
            >
              「{query}」 ×
            </button>
          ) : null}
          {year ? (
            <button
              type="button"
              onClick={() => {
                setYear("");
                resetVisibleCount();
              }}
            >
              {year}年 ×
            </button>
          ) : null}
          {teamId ? (
            <button
              type="button"
              onClick={() => {
                setTeamId("");
                resetVisibleCount();
              }}
            >
              {teams.find((team) => team.id === teamId)?.name} ×
            </button>
          ) : null}
          {featuredOnly ? (
            <button
              type="button"
              onClick={() => {
                setFeaturedOnly(false);
                resetVisibleCount();
              }}
            >
              注目作品 ×
            </button>
          ) : null}
        </div>
      </div>

      {visibleWorks.length ? (
        <div className="archive-grid">
          {visibleWorks.map((work) => (
            <WorkCard work={work} key={work.id} />
          ))}
        </div>
      ) : (
        <div className="archive-empty">
          <p>条件に一致する作品がありません。</p>
          <button type="button" onClick={resetFilters}>
            すべての作品を表示
          </button>
        </div>
      )}

      {visibleCount < filteredWorks.length ? (
        <div className="load-more">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + pageSize)}
          >
            もっと見る
            <span>
              {visibleCount} / {filteredWorks.length}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
