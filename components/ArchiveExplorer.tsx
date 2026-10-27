"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  type MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  type ArchiveTeam,
  formatYearRange,
  getTeamHref,
  getTeamSearchText,
  getYearHref,
  normalizeSearchText,
  type PresentedWork,
  type YearSummary,
} from "@/lib/archive";
import { announcePlayback, useExclusivePlayback } from "@/lib/playback";
import {
  getYoutubeEmbedUrl,
  getYoutubeUrl,
  sortWorksNewestFirst,
} from "@/lib/yosakoi";
import { TeamMark } from "./TeamMark";
import { TeamTile } from "./TeamTile";
import { WorkCard } from "./WorkCard";

type ArchiveExplorerProps = {
  works: PresentedWork[];
  teams: ArchiveTeam[];
  years: YearSummary[];
};

type UrlChanges = Partial<Record<"view" | "team" | "year" | "q", string | null>>;
type PendingFocus = { kind: "heading" } | { kind: "tile"; teamId: string };

const desktopPageSize = 24;
const mobilePageSize = 12;
const playbackSourceId = "archive-explorer";

function isPlainLeftClick(event: MouseEvent<HTMLAnchorElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    !event.altKey
  );
}

type WorkGridProps = {
  works: PresentedWork[];
  activeWorkId: string | null;
  playbackMode: "inline" | "modal";
  onTogglePlayback: (workId: string) => void;
};

function WorkGrid({
  works,
  activeWorkId,
  playbackMode,
  onTogglePlayback,
}: WorkGridProps) {
  return (
    <div className="archive-grid">
      {works.map((work) => (
        <WorkCard
          work={work}
          isActive={activeWorkId === work.id}
          playbackMode={playbackMode}
          onTogglePlayback={() => onTogglePlayback(work.id)}
          key={work.id}
        />
      ))}
    </div>
  );
}

export function ArchiveExplorer({ works, teams, years }: ArchiveExplorerProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const pendingFocusRef = useRef<PendingFocus | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const modalCloseRef = useRef<HTMLButtonElement>(null);
  const playbackTriggerRef = useRef<HTMLElement | null>(null);

  const sortedWorks = useMemo(() => sortWorksNewestFirst(works), [works]);
  const teamById = useMemo(
    () => new Map(teams.map((team) => [team.id, team])),
    [teams],
  );
  const worksById = useMemo(
    () => new Map(works.map((work) => [work.id, work])),
    [works],
  );
  const teamSearchText = useMemo(
    () => new Map(teams.map((team) => [team.id, getTeamSearchText(team)])),
    [teams],
  );

  const teamParam = searchParams.get("team");
  const selectedTeam = teamParam ? teamById.get(teamParam) : undefined;
  const yearParam = Number(searchParams.get("year"));
  const hasValidYear = years.some((item) => item.year === yearParam);
  const view =
    !selectedTeam &&
    (searchParams.get("view") === "years" || hasValidYear)
      ? "years"
      : "teams";
  const selectedYear = hasValidYear ? yearParam : years[0]?.year;

  const [queryInput, setQueryInput] = useState(searchParams.get("q") ?? "");
  const [extraPages, setExtraPages] = useState(0);
  const [pageSize, setPageSize] = useState(desktopPageSize);
  const [isMobilePlayback, setIsMobilePlayback] = useState(false);
  const [activeWorkId, setActiveWorkId] = useState<string | null>(null);

  const normalizedQuery = normalizeSearchText(queryInput.trim());
  const isSearching = normalizedQuery.length > 0;

  useExclusivePlayback(playbackSourceId, () => setActiveWorkId(null));

  useEffect(() => {
    const pageSizeQuery = window.matchMedia("(max-width: 720px)");
    const playbackQuery = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setPageSize(pageSizeQuery.matches ? mobilePageSize : desktopPageSize);
      setIsMobilePlayback(playbackQuery.matches);
      setActiveWorkId(null);
    };

    update();
    pageSizeQuery.addEventListener("change", update);
    playbackQuery.addEventListener("change", update);
    return () => {
      pageSizeQuery.removeEventListener("change", update);
      playbackQuery.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    function handlePopState() {
      const params = new URLSearchParams(window.location.search);
      setQueryInput(params.get("q") ?? "");
      setExtraPages(0);
      setActiveWorkId(null);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const updateUrl = useCallback(
    (changes: UrlChanges, method: "push" | "replace") => {
      const params = new URLSearchParams(window.location.search);

      for (const [key, value] of Object.entries(changes)) {
        if (value) params.set(key, value);
        else params.delete(key);
      }

      const query = params.toString();
      const url = query ? `${pathname}?${query}` : pathname;

      if (method === "push") window.history.pushState(null, "", url);
      else window.history.replaceState(null, "", url);
    },
    [pathname],
  );

  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;
    pendingFocusRef.current = null;

    if (pending.kind === "heading") {
      headingRef.current?.focus({ preventScroll: true });
      topRef.current?.scrollIntoView({ block: "start" });
      return;
    }

    const tile = document.querySelector<HTMLElement>(
      `.team-index-grid [data-team-id="${CSS.escape(pending.teamId)}"]`,
    );
    tile?.focus({ preventScroll: true });
    tile?.scrollIntoView({ block: "center" });
  }, [selectedTeam?.id, view, selectedYear, isSearching]);

  function selectTeam(teamId: string) {
    pendingFocusRef.current = { kind: "heading" };
    setQueryInput("");
    setActiveWorkId(null);
    updateUrl({ team: teamId, view: null, year: null, q: null }, "push");
  }

  function showTeamIndex(focusTeamId?: string) {
    pendingFocusRef.current = focusTeamId
      ? { kind: "tile", teamId: focusTeamId }
      : { kind: "heading" };
    setActiveWorkId(null);
    updateUrl({ team: null, view: null, year: null }, "push");
  }

  function showYears(year?: number) {
    pendingFocusRef.current = { kind: "heading" };
    setActiveWorkId(null);
    updateUrl(
      { view: "years", year: year ? String(year) : null, team: null },
      view === "years" ? "replace" : "push",
    );
  }

  function handleQueryChange(value: string) {
    setQueryInput(value);
    setExtraPages(0);
    setActiveWorkId(null);
    updateUrl({ q: value.trim() ? value : null }, "replace");
  }

  function clearQuery() {
    handleQueryChange("");
  }

  const teamWorks = useMemo(
    () =>
      selectedTeam
        ? sortedWorks.filter((work) => work.teamId === selectedTeam.id)
        : [],
    [selectedTeam, sortedWorks],
  );

  const yearWorks = useMemo(
    () =>
      selectedYear
        ? sortedWorks.filter((work) => work.years.includes(selectedYear))
        : [],
    [selectedYear, sortedWorks],
  );

  const matchingTeams = useMemo(
    () =>
      isSearching
        ? teams.filter((team) =>
            teamSearchText.get(team.id)?.includes(normalizedQuery),
          )
        : [],
    [isSearching, normalizedQuery, teamSearchText, teams],
  );

  const searchResults = useMemo(() => {
    if (!isSearching) return [];

    return sortedWorks.filter((work) => {
      const searchable = [
        teamSearchText.get(work.teamId) ?? "",
        normalizeSearchText(work.workTitle ?? ""),
        work.years.join(" "),
      ].join(" ");

      return searchable.includes(normalizedQuery);
    });
  }, [isSearching, normalizedQuery, sortedWorks, teamSearchText]);

  const visibleSearchResults = searchResults.slice(
    0,
    pageSize * (extraPages + 1),
  );

  const visibleWorks = isSearching
    ? visibleSearchResults
    : selectedTeam
      ? teamWorks
      : view === "years"
        ? yearWorks
        : [];
  const activeWork =
    activeWorkId && visibleWorks.some((work) => work.id === activeWorkId)
      ? worksById.get(activeWorkId)
      : undefined;

  function closePlayback({ restoreFocus = true } = {}) {
    setActiveWorkId(null);
    if (restoreFocus) {
      window.requestAnimationFrame(() => playbackTriggerRef.current?.focus());
    }
  }

  function togglePlayback(workId: string) {
    if (activeWorkId === workId) {
      closePlayback();
      return;
    }

    playbackTriggerRef.current = document.activeElement as HTMLElement | null;
    setActiveWorkId(workId);
    announcePlayback(playbackSourceId);
  }

  useEffect(() => {
    if (isMobilePlayback || !activeWorkId) return;

    modalCloseRef.current?.focus();

    function handleModalKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        setActiveWorkId(null);
        window.requestAnimationFrame(() => playbackTriggerRef.current?.focus());
        return;
      }

      if (event.key !== "Tab" || !modalRef.current) return;

      const focusable = Array.from(
        modalRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], iframe, [tabindex]:not([tabindex="-1"])',
        ),
      );
      const first = focusable[0];
      const last = focusable.at(-1);

      if (!first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleModalKeyDown);
    return () => document.removeEventListener("keydown", handleModalKeyDown);
  }, [activeWorkId, isMobilePlayback]);

  const statusText = isSearching
    ? `「${queryInput.trim()}」に一致する作品 ${searchResults.length}件`
    : selectedTeam
      ? `${selectedTeam.name}の作品 ${teamWorks.length}件`
      : view === "years"
        ? `${selectedYear}年の作品 ${yearWorks.length}件`
        : `${teams.length}チーム・${works.length}作品`;

  const teamIndex = selectedTeam
    ? teams.findIndex((team) => team.id === selectedTeam.id)
    : -1;
  const previousTeam = teamIndex > 0 ? teams[teamIndex - 1] : undefined;
  const nextTeam =
    teamIndex >= 0 && teamIndex < teams.length - 1
      ? teams[teamIndex + 1]
      : undefined;
  const yearIndex = years.findIndex((item) => item.year === selectedYear);
  const newerYear = yearIndex > 0 ? years[yearIndex - 1] : undefined;
  const olderYear =
    yearIndex >= 0 && yearIndex < years.length - 1
      ? years[yearIndex + 1]
      : undefined;

  const renderWorkGrid = (list: PresentedWork[]) => (
    <WorkGrid
      works={list}
      activeWorkId={activeWorkId}
      playbackMode={isMobilePlayback ? "inline" : "modal"}
      onTogglePlayback={togglePlayback}
    />
  );

  return (
    <div className="explorer" ref={topRef}>
      <div className="explorer__bar">
        <nav className="explorer__modes" aria-label="作品のたどり方">
          <a
            href="/archive"
            aria-current={!isSearching && view === "teams" ? "page" : undefined}
            onClick={(event) => {
              if (!isPlainLeftClick(event)) return;
              event.preventDefault();
              if (!isSearching && view === "teams" && !selectedTeam) return;
              if (isSearching) clearQuery();
              showTeamIndex(selectedTeam?.id);
            }}
          >
            チームからたどる
          </a>
          <a
            href="/archive?view=years"
            aria-current={!isSearching && view === "years" ? "page" : undefined}
            onClick={(event) => {
              if (!isPlainLeftClick(event)) return;
              event.preventDefault();
              if (!isSearching && view === "years") return;
              if (isSearching) clearQuery();
              showYears(view === "years" ? selectedYear : undefined);
            }}
          >
            年度からたどる
          </a>
        </nav>

        <div className="explorer__search" role="search">
          <label htmlFor="archive-query">チーム名・曲名・年度で探す</label>
          <div className="explorer__search-field">
            <span aria-hidden="true">⌕</span>
            <input
              id="archive-query"
              type="search"
              value={queryInput}
              placeholder="例：國士舞双、青き羅針盤、2025"
              autoComplete="off"
              onChange={(event) => handleQueryChange(event.target.value)}
            />
            {queryInput ? (
              <button type="button" onClick={clearQuery}>
                クリア
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <p className="explorer__status" aria-live="polite">
        {statusText}
      </p>

      {isSearching ? (
        <section className="explorer__panel" aria-labelledby="explorer-heading">
          {matchingTeams.length ? (
            <div className="search-teams">
              <h3>一致するチーム</h3>
              <ul>
                {matchingTeams.map((team) => (
                  <li key={team.id}>
                    <a
                      href={getTeamHref(team.id)}
                      onClick={(event) => {
                        if (!isPlainLeftClick(event)) return;
                        event.preventDefault();
                        selectTeam(team.id);
                      }}
                    >
                      {team.mark ? (
                        <TeamMark mark={team.mark} size={96} />
                      ) : null}
                      <span>
                        <strong>{team.name}</strong>
                        <small>
                          {formatYearRange(team.oldestYear, team.newestYear)}・
                          {team.workCount}作品
                        </small>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <h2 className="explorer__heading" id="explorer-heading" ref={headingRef} tabIndex={-1}>
            「{queryInput.trim()}」に一致する作品
          </h2>

          {visibleSearchResults.length ? (
            renderWorkGrid(visibleSearchResults)
          ) : (
            <div className="archive-empty">
              <p>条件に一致する作品がありません。</p>
              <button type="button" onClick={clearQuery}>
                検索をクリアする
              </button>
            </div>
          )}

          {visibleSearchResults.length < searchResults.length ? (
            <div className="load-more">
              <button
                type="button"
                onClick={() => {
                  setExtraPages((pages) => pages + 1);
                  setActiveWorkId(null);
                }}
              >
                もっと見る
                <span>
                  {visibleSearchResults.length} / {searchResults.length}
                </span>
              </button>
            </div>
          ) : null}
        </section>
      ) : selectedTeam ? (
        <section className="explorer__panel team-detail" aria-labelledby="explorer-heading">
          <a
            className="team-detail__back"
            href="/archive"
            onClick={(event) => {
              if (!isPlainLeftClick(event)) return;
              event.preventDefault();
              showTeamIndex(selectedTeam.id);
            }}
          >
            <span aria-hidden="true">←</span> チーム一覧へ戻る
          </a>

          <header className="team-detail__head">
            {selectedTeam.mark ? (
              <div className="team-detail__mark">
                <TeamMark mark={selectedTeam.mark} size={200} priority />
              </div>
            ) : null}
            <div className="team-detail__title">
              <p className="eyebrow">チームの作品</p>
              <h2 id="explorer-heading" ref={headingRef} tabIndex={-1}>
                {selectedTeam.name}
              </h2>
              {selectedTeam.archiveName !== selectedTeam.name ? (
                <p className="team-detail__alias">
                  別表記：{selectedTeam.archiveName}
                </p>
              ) : null}
              <dl className="team-detail__facts">
                <div>
                  <dt>年度</dt>
                  <dd>
                    {formatYearRange(
                      selectedTeam.oldestYear,
                      selectedTeam.newestYear,
                    )}
                  </dd>
                </div>
                <div>
                  <dt>作品</dt>
                  <dd>{selectedTeam.workCount}作品</dd>
                </div>
              </dl>
            </div>
          </header>

          {renderWorkGrid(teamWorks)}

          <nav className="explorer__pager" aria-label="ほかのチーム">
            {previousTeam ? (
              <a
                href={getTeamHref(previousTeam.id)}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  selectTeam(previousTeam.id);
                }}
              >
                <span aria-hidden="true">←</span>
                <span>
                  <small>前のチーム</small>
                  {previousTeam.name}
                </span>
              </a>
            ) : (
              <span />
            )}
            {nextTeam ? (
              <a
                className="explorer__pager-next"
                href={getTeamHref(nextTeam.id)}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  selectTeam(nextTeam.id);
                }}
              >
                <span>
                  <small>次のチーム</small>
                  {nextTeam.name}
                </span>
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </nav>
        </section>
      ) : view === "years" ? (
        <section className="explorer__panel" aria-labelledby="explorer-heading">
          <nav className="year-picker" aria-label="年度を選ぶ">
            <ol>
              {years.map((item) => (
                <li key={item.year}>
                  <a
                    href={getYearHref(item.year)}
                    aria-current={item.year === selectedYear ? "true" : undefined}
                    onClick={(event) => {
                      if (!isPlainLeftClick(event)) return;
                      event.preventDefault();
                      if (item.year === selectedYear) return;
                      showYears(item.year);
                    }}
                  >
                    <strong>{item.year}</strong>
                    <small>{item.count}作品</small>
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <h2 className="explorer__heading" id="explorer-heading" ref={headingRef} tabIndex={-1}>
            {selectedYear}年の作品
          </h2>

          {renderWorkGrid(yearWorks)}

          <nav className="explorer__pager" aria-label="ほかの年度">
            {newerYear ? (
              <a
                href={getYearHref(newerYear.year)}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  showYears(newerYear.year);
                }}
              >
                <span aria-hidden="true">←</span>
                <span>
                  <small>新しい年度</small>
                  {newerYear.year}年
                </span>
              </a>
            ) : (
              <span />
            )}
            {olderYear ? (
              <a
                className="explorer__pager-next"
                href={getYearHref(olderYear.year)}
                onClick={(event) => {
                  if (!isPlainLeftClick(event)) return;
                  event.preventDefault();
                  showYears(olderYear.year);
                }}
              >
                <span>
                  <small>前の年度</small>
                  {olderYear.year}年
                </span>
                <span aria-hidden="true">→</span>
              </a>
            ) : null}
          </nav>
        </section>
      ) : (
        <section className="explorer__panel" aria-labelledby="explorer-heading">
          <div className="explorer__intro">
            <h2 className="explorer__heading" id="explorer-heading" ref={headingRef} tabIndex={-1}>
              チームを選ぶ
            </h2>
            <p>
              マークか名前を選ぶと、そのチームの全年度の作品が並びます。
            </p>
          </div>
          <ul className="team-index-grid">
            {teams.map((team, index) => (
              <li key={team.id}>
                <TeamTile
                  team={team}
                  href={getTeamHref(team.id)}
                  latestWork={worksById.get(team.latestWorkId)}
                  priority={index < 8}
                  onSelect={(event) => {
                    if (!isPlainLeftClick(event)) return;
                    event.preventDefault();
                    selectTeam(team.id);
                  }}
                />
              </li>
            ))}
          </ul>
        </section>
      )}

      {!isMobilePlayback && activeWork?.youtubeId ? (
        <div
          className="archive-player-modal"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closePlayback();
          }}
        >
          <div
            className="archive-player-modal__dialog"
            id="archive-playback-dialog"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="archive-playback-title"
          >
            <button
              className="archive-player-modal__close"
              ref={modalCloseRef}
              type="button"
              onClick={() => closePlayback()}
              aria-label={`${activeWork.teamLabel}「${activeWork.workTitle ?? "演舞楽曲"}」の再生を閉じる`}
            >
              <span aria-hidden="true">×</span>
              閉じる
            </button>
            <div className="archive-player-modal__video">
              <iframe
                src={getYoutubeEmbedUrl(activeWork.youtubeId, true)}
                title={`${activeWork.teamLabel}「${activeWork.workTitle ?? "演舞楽曲"}」を再生`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            <div className="archive-player-modal__copy">
              <div>
                <p>{activeWork.teamLabel}</p>
                <h2 id="archive-playback-title">
                  {activeWork.workTitle ?? "演舞楽曲"}
                </h2>
              </div>
              <a
                href={getYoutubeUrl(activeWork.youtubeId)}
                target="_blank"
                rel="noreferrer"
              >
                YouTubeで見る ↗
              </a>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
