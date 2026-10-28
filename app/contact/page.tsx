import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { StudioShell } from "@/components/studio/StudioShell";

export const metadata: Metadata = {
  title: {
    absolute: "お問い合わせ｜よさこい楽曲制作｜UNITED STUDIO",
  },
  description:
    "よさこい演舞楽曲制作のご相談はこちら。制作時期や内容を確認し、可能な範囲で新規制作のご相談を承っています。",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <StudioShell>
    <section className="studio-document-head" aria-labelledby="contact-title"><p className="studio-section-label">制作の相談</p><h1 id="contact-title">次の演舞のことを、<br />聞かせてください。</h1><p>チームのテーマ、演舞の構想、ご希望の時期。現在決まっていることから、お聞かせください。</p></section>
    <section className="studio-contact" aria-labelledby="contact-form-title">
      <aside className="studio-contact__note"><h2>ご相談の前に</h2><p>年間の制作予定は、継続してご依頼いただいているチームを中心に組んでいます。新規のご依頼は、制作時期や内容を確認し、可能な範囲で制作枠を調整しています。</p><p>テーマや演舞構成、収録内容によって工程が変わるため、一律の料金表は掲載していません。</p><p>継続制作の場合も、年度や時期によって対応が難しいことがあります。ご希望の時期が決まっている場合は、お早めにご相談ください。</p><dl><div><dt>伝えていただきたいこと</dt><dd>演舞予定年度・音源が必要な時期</dd><dd>制作を希望する内容</dd><dd>チームの活動状況や演舞のイメージ</dd></div></dl><p className="studio-note">未定の項目は、現段階の予定やご希望をご記入ください。</p></aside>
      <div className="studio-contact__form"><h2 id="contact-form-title">制作希望の内容</h2><ContactForm /></div>
    </section>
  </StudioShell>;
}
