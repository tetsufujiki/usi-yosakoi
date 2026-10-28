import Link from "next/link";

export function StudioApproach() {
  return <section id="approach" className="studio-approach" aria-labelledby="studio-approach-title">
    <div className="studio-section-kicker"><span>制作の姿勢</span><span aria-hidden="true">02</span></div>
    <div className="studio-approach__intro">
      <h2 id="studio-approach-title">一つのチームと、<br />深くつくる。</h2>
      <p>毎年、高いオリジナリティーを求める各チームと、対話を重ねながら作品をつくり、翌年、その先へと音楽を重ねていく。その積み重ねを大切にしながら、一つひとつの演舞にふさわしい音を追求します。</p>
    </div>
    <div className="studio-approach__notes">
      <article><span>01</span><h3>チームから、考える。</h3><p>テーマ、演舞の構成、踊り子の声、チームの想いを聞きながら、音楽の出発点を探します。難しいと感じる部分があれば率直にお伝えし、さらに対話を重ねながら方向性を定めます。</p></article>
      <article><span>02</span><h3>演舞の流れを、つくる。</h3><p>リズム、音色、メロディーなど、曲の出発点はすべて異なります。その演舞にふさわしい展開を探りながら、編曲、レコーディングへと進み、ひとつの作品として仕上げていきます。</p></article>
      <article><span>03</span><h3>最後の響きまで、向き合う。</h3><p>ミックス、マスタリングとさらに音を磨いていく工程。会場や地方車の再生環境も考え、演舞を支える音へ整えていきます。</p></article>
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
