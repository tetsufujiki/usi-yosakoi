import Link from "next/link";

export function StudioApproach() {
  return <section id="approach" className="studio-approach" aria-labelledby="studio-approach-title">
    <div className="studio-section-kicker"><span>制作の姿勢</span><span aria-hidden="true">02</span></div>
    <div className="studio-approach__intro">
      <h2 id="studio-approach-title">一組のチームと、<br />深くつくる。</h2>
      <p>高いオリジナリティーを求めるチームと、対話から作品をつくり、翌年、その先へと音楽を重ねていく。いま一緒につくっているチームとの時間を大切にしながら、一つひとつの演舞に向き合っています。</p>
    </div>
    <div className="studio-approach__notes">
      <article><span>01</span><h3>チームから、考える。</h3><p>テーマ、演舞の構成、踊り子の声。まずチームの想いを聞き、音楽の出発点を探します。</p></article>
      <article><span>02</span><h3>演舞の流れを、つくる。</h3><p>リズム、音色、フレーズを試し、その演舞に合う展開を組み立てます。作編曲と収録を重ね、作品にしていきます。</p></article>
      <article><span>03</span><h3>最後の響きまで、向き合う。</h3><p>ミックス、マスタリングまで一貫して。会場や地方車の再生環境も考え、演舞を支える音へ仕上げます。</p></article>
    </div>
    <Link className="studio-editorial-link" href="/process">制作の進め方・よくいただく質問 <span aria-hidden="true">↗</span></Link>
  </section>;
}

export function StudioInvitation() {
  return <section className="studio-invitation" aria-labelledby="studio-invitation-title">
    <div><p className="studio-section-label">制作の相談</p><h2 id="studio-invitation-title">次の演舞のことを、<br />聞かせてください。</h2></div>
    <div><p>年間の制作予定は、継続してご依頼いただいているチームを中心に組んでいます。新たなご相談は、制作時期や内容を伺い、調整ができる場合に進めています。</p><Link className="studio-editorial-link" href="/contact">制作について相談する <span aria-hidden="true">↗</span></Link></div>
  </section>;
}
