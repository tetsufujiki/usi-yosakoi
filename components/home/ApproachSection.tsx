import Link from "next/link";

const steps = ["ヒアリング", "響きの探索", "作編曲", "収録", "仕上げ"];

export function ApproachSection() {
  return (
    <section className="approach section" aria-labelledby="approach-title">
      <div className="frame approach__inner">
        <div className="approach__heading">
          <p className="eyebrow">制作について</p>
          <h2 id="approach-title">
            <span>一つの対話から、</span>
            <span>演舞を動かす音へ。</span>
          </h2>
        </div>

        <div className="approach__body">
          <p>
            UNITED STUDIOは、2008年より全国のよさこいチームへ演舞楽曲を制作してきました。チームにある物語を聞き、その演舞にしかない時間の流れを音楽へ変えていきます。
          </p>
          <p>
            チームとの対話から音の種を探し、楽曲として育て、最後の響きまで丁寧に仕上げる。音楽をつくるとは、作編曲だけではなく、音色の選択からミキシング、マスタリングに至るまで、すべての工程に向き合うことだと考えています。
          </p>
          <ol className="approach__flow" aria-label="制作の流れ">
            {steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
          <Link className="text-link" href="/process">
            制作の進め方と、よくいただく質問
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
