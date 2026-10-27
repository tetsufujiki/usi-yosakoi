import { Reveal } from "../Reveal";
import { YosakoiHeroKinetics } from "../YosakoiHeroKinetics";

const phases = [
  { ja: "隊列", en: "FORMATION" },
  { ja: "流れ", en: "FLOW" },
  { ja: "解放", en: "BURST" },
] as const;

export function MovementBridge() {
  return (
    <Reveal as="section" className="movement" aria-labelledby="movement-title">
      <div className="movement__stage" aria-hidden="true">
        <YosakoiHeroKinetics variant="bridge" />
        <div className="movement__formation">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        <p className="movement__poem">
          <span>heat gathers,</span>
          <span>a current turns,</span>
          <span>and the scene opens</span>
        </p>
      </div>

      <div className="frame movement__inner">
        <ol className="movement__index" aria-label="演舞の三つの場面">
          {phases.map((phase) => (
            <li key={phase.en}>
              <span>{phase.ja}</span>
              <small lang="en">{phase.en}</small>
            </li>
          ))}
        </ol>

        <div className="movement__copy">
          <h2 id="movement-title">
            <span>隊列が組まれ、流れが生まれ、</span>
            <span>音とともに解き放たれる。</span>
          </h2>
          <p>
            一曲一曲の先に、ひとつのチームと重ねてきた歩みがあります。
            2008年から音楽を重ねてきた、國士舞双の記録へ。
          </p>
        </div>
      </div>

      <div className="movement__settle" aria-hidden="true" />
    </Reveal>
  );
}
