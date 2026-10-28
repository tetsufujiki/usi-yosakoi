"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { ArchiveCard } from "@/components/v2/ArchiveCard";
import { OPEN_YEAR_COUNT, type StageYear } from "@/lib/year-archive";

type HeadingLevel = "h2" | "h3" | "h4";

const subHeading: Record<HeadingLevel, HeadingLevel> = {
  h2: "h3",
  h3: "h4",
  h4: "h4",
};

type YearBlockProps = {
  year: StageYear;
  variant: "lead" | "standard" | "compact";
  heading: HeadingLevel;
  aside?: ReactNode;
};

function YearBlock({ year, variant, heading: Heading, aside }: YearBlockProps) {
  const headingId = `year-${year.year}`;

  return (
    <section
      className={`v2-year v2-year--${variant}`}
      aria-labelledby={headingId}
    >
      <div className="v2-year__head">
        {aside ? <div className="v2-year__aside">{aside}</div> : null}
        <div className="v2-year__label">
          <Heading id={headingId} className="v2-year__number" tabIndex={-1}>
            {year.year}
            <span className="sr-only">年の作品</span>
          </Heading>
          <p className="v2-year__count">
            <span>{year.works.length}</span>作品
          </p>
        </div>
      </div>
      <ul className={`v2-grid v2-grid--${variant}`}>
        {year.works.map((work) => (
          <li key={work.id}>
            <ArchiveCard work={work} />
          </li>
        ))}
      </ul>
    </section>
  );
}

type YearArchiveProps = {
  years: StageYear[];
  heading?: HeadingLevel;
  /** Placed beside the newest year, e.g. the page title when the archive is the hero. */
  leadAside?: ReactNode;
};

export function YearArchive({
  years,
  heading = "h2",
  leadAside,
}: YearArchiveProps) {
  const recent = years.slice(0, OPEN_YEAR_COUNT);
  const older = years.slice(OPEN_YEAR_COUNT);
  const [isOlderOpen, setIsOlderOpen] = useState(false);
  const olderRef = useRef<HTMLElement>(null);
  const olderPanelId = useId();
  const olderTitleId = useId();
  const OlderTitle = heading;

  const olderWorkCount = older.reduce((sum, year) => sum + year.works.length, 0);
  const olderRange = older.length
    ? `${older.at(-1)?.year}–${older[0].year}`
    : "";

  function openOlderAt(targetYear: number) {
    flushSync(() => setIsOlderOpen(true));
    const target = document.getElementById(`year-${targetYear}`);
    target?.scrollIntoView({ block: "start" });
    target?.focus({ preventScroll: true });
  }

  function toggleOlder() {
    if (!isOlderOpen) {
      openOlderAt(older[0].year);
      return;
    }

    flushSync(() => setIsOlderOpen(false));
    olderRef.current?.scrollIntoView({ block: "start" });
  }

  return (
    <div className="v2-archive">
      {recent.map((year, index) => (
        <YearBlock
          key={year.year}
          year={year}
          variant={index === 0 ? "lead" : "standard"}
          heading={heading}
          aside={index === 0 ? leadAside : undefined}
        />
      ))}

      {older.length ? (
        <section
          ref={olderRef}
          className="v2-older"
          aria-labelledby={olderTitleId}
        >
          <div className="v2-older__head">
            <OlderTitle id={olderTitleId} className="v2-older__title">
              以前の年度
            </OlderTitle>
            <p className="v2-older__meta">
              {olderRange}
              <span aria-hidden="true"> / </span>
              {olderWorkCount}作品
            </p>
          </div>

          <ul className="v2-older__years">
            {older.map((year) => (
              <li key={year.year}>
                <button
                  className="v2-older__year"
                  type="button"
                  aria-controls={olderPanelId}
                  onClick={() => openOlderAt(year.year)}
                >
                  <span className="v2-older__year-number">{year.year}</span>
                  <span className="v2-older__year-count">
                    {year.works.length}作品
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="v2-older__actions">
            <button
              className="v2-older__toggle"
              type="button"
              aria-expanded={isOlderOpen}
              aria-controls={olderPanelId}
              onClick={toggleOlder}
            >
              {isOlderOpen ? "以前の年度を閉じる" : "以前の年度を開く"}
              <span aria-hidden="true">{isOlderOpen ? "↑" : "↓"}</span>
            </button>
            <p className="v2-older__note">
              年度をまたぐ作品（例: 2025–26）は、最新の年度に掲載しています。
            </p>
          </div>

          <div id={olderPanelId} hidden={!isOlderOpen}>
            {older.map((year) => (
              <YearBlock
                key={year.year}
                year={year}
                variant="compact"
                heading={subHeading[heading]}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
