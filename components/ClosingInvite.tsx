import Link from "next/link";

type ClosingInviteProps = {
  headingId?: string;
  /** Adds a quiet path to the production page for visitors who skipped it. */
  showProcessLink?: boolean;
};

export function ClosingInvite({
  headingId = "invite-title",
  showProcessLink = false,
}: ClosingInviteProps) {
  return (
    <section className="invite section" aria-labelledby={headingId}>
      <div className="frame invite__inner">
        <h2 id={headingId}>
          <span>そのチームにしかない音を、</span>
          <span>対話から一緒に探します。</span>
        </h2>
        <div className="invite__body">
          <p>
            制作時期や内容を伺い、調整ができる場合にご相談を進めています。演舞の予定や、チームのことをお聞かせください。
          </p>
          <div className="invite__links">
            <Link className="invite__link" href="/contact">
              制作について相談する
              <span aria-hidden="true">→</span>
            </Link>
            {showProcessLink ? (
              <Link className="text-link" href="/process">
                作品を支える、音づくりの考え方
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
