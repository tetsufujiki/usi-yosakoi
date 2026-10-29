"use client";

import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { FilterRail, type RailOption } from "@/components/studio/FilterRail";
import { SoundCard } from "@/components/studio/SoundCard";
import { TeamMark } from "@/components/TeamMark";
import { findTeamMark } from "@/lib/team-marks";
import type { StageArchive } from "@/lib/year-archive";
import { STUDIO_ARCHIVE_EVENT } from "@/lib/studio-navigation";

const PAGE_SIZE = 12;

export function ArchiveBrowser({ archive, initialYear, initialTeam = "all", initialQuery = "", showSearch = false, collapsibleSearch = false, syncUrl = false }: {
  archive: StageArchive; initialYear?: string; initialTeam?: string; initialQuery?: string; showSearch?: boolean; collapsibleSearch?: boolean; syncUrl?: boolean;
}) {
  const defaultYear = initialYear ?? String(archive.newestYear);
  const [urlReady, setUrlReady] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const composingRef = useRef(false);
  const [isComposing, setIsComposing] = useState(false);
  const [filters, setFilters] = useState(() => ({
    year: initialYear === "all" || archive.works.some((work) => work.years.includes(Number(initialYear))) ? initialYear! : String(archive.newestYear),
    team: archive.works.some((work) => work.teamId === initialTeam) ? initialTeam : "all", query: initialQuery.slice(0, 200), limit: PAGE_SIZE,
  }));
  const selectYear = useCallback((year: string) => setFilters((current) => current.year === year ? current : { ...current, year, limit: PAGE_SIZE }), []);
  const selectTeam = useCallback((team: string) => setFilters((current) => current.team === team ? current : { ...current, team, limit: PAGE_SIZE }), []);

  useEffect(() => {
    function request(event: Event) {
      const detail = (event as CustomEvent<{ team?: string }>).detail;
      const team = archive.works.some((work) => work.teamId === detail?.team) ? detail.team! : "all";
      setFilters({ year: "all", team, query: "", limit: PAGE_SIZE });
    }
    function restore() {
      const params = new URLSearchParams(window.location.search);
      const year = params.get("year") ?? defaultYear;
      const team = params.get("team") ?? "all";
      setFilters({ year: year === "all" || archive.works.some((work) => work.years.includes(Number(year))) ? year : defaultYear, team: archive.works.some((work) => work.teamId === team) ? team : "all", query: (params.get("q") ?? "").slice(0, 200), limit: PAGE_SIZE });
    }
    let initialRestore = 0;
    window.addEventListener(STUDIO_ARCHIVE_EVENT, request);
    if (syncUrl) {
      // Read the browser URL after hydration before writing filter changes back.
      initialRestore = requestAnimationFrame(() => { restore(); setUrlReady(true); });
      window.addEventListener("popstate", restore);
    }
    return () => { cancelAnimationFrame(initialRestore); window.removeEventListener(STUDIO_ARCHIVE_EVENT, request); window.removeEventListener("popstate", restore); };
  }, [archive.works, defaultYear, syncUrl]);

  useEffect(() => {
    if (!syncUrl || !urlReady || isComposing) return;
    const params = new URLSearchParams(window.location.search);
    for (const [key, value] of [["year", filters.year], ["team", filters.team], ["q", filters.query.trim()]]) {
      if (!value || value === (key === "year" ? defaultYear : "all")) params.delete(key); else params.set(key, value);
    }
    const url = `${window.location.pathname}${params.size ? `?${params}` : ""}${window.location.hash}`;
    if (url !== `${window.location.pathname}${window.location.search}${window.location.hash}`) window.history.replaceState(null, "", url);
  }, [filters.year, filters.team, filters.query, defaultYear, syncUrl, urlReady, isComposing]);

  useEffect(() => { if (searchOpen) searchRef.current?.focus({ preventScroll: true }); }, [searchOpen]);

  // Let the browser own the in-progress IME text; only confirmed text filters
  // results or updates history. External clear/back actions still sync the field.
  useEffect(() => {
    const input = searchRef.current;
    if (input && !composingRef.current && input.value !== filters.query) input.value = filters.query;
  }, [filters.query]);

  const commitQuery = useCallback((query: string) => setFilters((current) => current.query === query ? current : { ...current, query, limit: PAGE_SIZE }), []);

  const queriedWorks = useMemo(() => {
    const query = filters.query.trim().normalize("NFKC").toLocaleLowerCase("ja");
    if (!query) return archive.works;
    return archive.works.filter((work) => {
      const mark = findTeamMark(work.teamName);
      return [work.teamName, work.workTitle, work.yearLabel, work.years.join(" "), mark?.shortName, ...(mark?.aliases ?? []), ...(mark?.archiveNames ?? [])].join(" ").normalize("NFKC").toLocaleLowerCase("ja").includes(query);
    });
  }, [archive.works, filters.query]);

  const teams = useMemo(() => {
    const byId = new Map<string, RailOption>();
    archive.works.forEach((work) => {
      const team = byId.get(work.teamId);
      if (team) team.count++;
      else byId.set(work.teamId, {
        id: work.teamId, label: work.teamName, shortLabel: findTeamMark(work.teamName)?.shortName,
        mark: work.mark, count: 1,
      });
    });
    return [...byId.values()].sort((a, b) => b.count - a.count || a.label.localeCompare(b.label, "ja"));
  }, [archive.works]);

  const years = useMemo(() => [...new Set(archive.works.flatMap((work) => work.years))].sort((a, b) => b - a), [archive.works]);
  const yearOptions: RailOption[] = [{ id: "all", label: "全年度", count: queriedWorks.filter((work) => filters.team === "all" || work.teamId === filters.team).length },
    ...years.map((year) => ({ id: String(year), label: String(year), count: queriedWorks.filter((work) => work.years.includes(year) && (filters.team === "all" || work.teamId === filters.team)).length }))];
  const countedTeams = teams.map((team) => ({ ...team, count: queriedWorks.filter((work) => work.teamId === team.id && (filters.year === "all" || work.years.includes(Number(filters.year)))).length }));
  // Keep a stable, readable order by lifetime work count across year filters.
  const teamOptions = [
    { id: "all", label: "全チーム", count: queriedWorks.filter((work) => filters.year === "all" || work.years.includes(Number(filters.year))).length },
    ...countedTeams,
  ];
  const matched = queriedWorks.filter((work) => (filters.year === "all" || work.years.includes(Number(filters.year))) && (filters.team === "all" || work.teamId === filters.team));
  const visibleLimit = filters.year === "all" ? filters.limit : matched.length;
  const queueIds = matched.filter((work) => work.youtubeId).map((work) => work.id);
  const selectedTeam = teams.find((team) => team.id === filters.team);
  const teamLabel = selectedTeam?.label ?? "全チーム";
  const reset = () => setFilters({ year: "all", team: "all", query: "", limit: PAGE_SIZE });

  const searchVisible = !collapsibleSearch || searchOpen || Boolean(filters.query);

  return (
    <>
      <h2 className="studio-library-title">MUSIC LIBRARY</h2>
      {showSearch ? <>
        {collapsibleSearch ? <div className="studio-search-toggle"><button type="button" aria-expanded={searchVisible} aria-controls={searchId} onClick={() => {
          if (searchVisible) { setSearchOpen(false); setFilters((current) => ({ ...current, query: "", limit: PAGE_SIZE })); }
          else setSearchOpen(true);
        }}>{searchVisible ? "検索を閉じる" : "曲名・キーワードで探す"} <span aria-hidden="true">{searchVisible ? "−" : "＋"}</span></button></div> : null}
        <div id={searchId} className="studio-search" hidden={!searchVisible}><label htmlFor={`${searchId}-input`}>チーム名・曲名・年度で検索</label><input ref={searchRef} id={`${searchId}-input`} type="search" placeholder="曲名やチーム名を入力" defaultValue={filters.query} maxLength={200}
          onCompositionStart={() => { composingRef.current = true; setIsComposing(true); }}
          onCompositionEnd={(event) => { composingRef.current = false; setIsComposing(false); commitQuery(event.currentTarget.value); }}
          onChange={(event) => { if (!composingRef.current && !(event.nativeEvent as InputEvent).isComposing) commitQuery(event.currentTarget.value); }} /></div>
      </> : null}
      <div className="archive-filter-deck">
        <FilterRail label="年度" kind="year" options={yearOptions} value={filters.year} onChange={selectYear} />
        <FilterRail label="チーム" kind="team" options={teamOptions} value={filters.team} onChange={selectTeam} />
      </div>
      <div className="archive-selection">
        <div className="archive-selection__conditions">
          <button type="button" onClick={() => selectYear("all")} aria-label="年度の絞り込みを解除">{filters.year === "all" ? "全年度" : filters.year}<span aria-hidden="true">{filters.year !== "all" ? " ×" : ""}</span></button>
          <span className="archive-selection__separator" aria-hidden="true">/</span>
          <button type="button" onClick={() => selectTeam("all")} aria-label="チームの絞り込みを解除">{teamLabel}<span aria-hidden="true">{filters.team !== "all" ? " ×" : ""}</span></button>
          {filters.query ? <button type="button" onClick={() => setFilters((current) => ({ ...current, query: "", limit: PAGE_SIZE }))} aria-label="検索語を解除">「{filters.query}」 ×</button> : null}
          <span className="archive-selection__count" role="status" aria-live="polite" aria-atomic="true">{matched.length}<span>作品</span></span>
        </div>
        <div className="archive-selection__actions">
          {filters.team !== "all" ? <button type="button" className="archive-clear-team" onClick={() => selectTeam("all")}>チーム解除 ×</button> : null}
          <button type="button" className="archive-selection__reset" onClick={reset}>すべて解除</button>
        </div>
      </div>
      {matched.length ? <>
        {selectedTeam ? <div className="studio-discography">
          {selectedTeam.mark ? <TeamMark mark={selectedTeam.mark} size={160} className="studio-discography__mark" /> : null}
          <div><p>チームと重ねた、演舞の記録</p><h2>{selectedTeam.label}</h2></div>
        </div> : null}
        <ul className={`studio-work-grid ${selectedTeam ? "studio-work-grid--tracks" : ""}`} aria-label="絞り込んだ作品">
          {matched.slice(0, visibleLimit).map((work) => <li key={work.id}><SoundCard work={work} queueIds={queueIds} compact={Boolean(selectedTeam)} /></li>)}
        </ul>
        {matched.length > visibleLimit ? <button type="button" className="archive-more" onClick={() => setFilters((current) => ({ ...current, limit: current.limit + PAGE_SIZE }))}>続きを見る <span>{Math.min(filters.limit, matched.length)} / {matched.length}</span><span aria-hidden="true">↓</span></button> : null}
      </> : <div className="archive-empty" role="status">
        <p>{filters.query ? "条件に合う作品が見つかりませんでした。" : `${filters.year}年の「${teamLabel}」の作品はありません。`}</p>
        <div>{filters.query ? <button className="archive-empty__primary" type="button" onClick={() => setFilters((current) => ({ ...current, query: "", limit: PAGE_SIZE }))}>検索語をクリア →</button> : <button className="archive-empty__primary" type="button" onClick={() => selectTeam("all")}>チームを解除して、{filters.year}年を見る →</button>}<button type="button" onClick={() => selectYear("all")}>このチームの全年度を見る →</button></div>
      </div>}
    </>
  );
}
