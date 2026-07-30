import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { YosakoiHeroKinetics } from "@/components/YosakoiHeroKinetics";

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
  return (
    <>
      <SiteHeader />
      <main id="main-content">
        <section className="contact-hero" aria-labelledby="contact-title">
          <YosakoiHeroKinetics variant="contact" />
          <div className="contact-hero__trace" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="frame contact-hero__inner">
            <div>
              <p className="section-label">PRODUCTION INQUIRY</p>
              <h1 id="contact-title" className="contact-hero__title">
                <span>制作をご検討</span>
                <span>中のチーム様</span>
              </h1>
            </div>
            <div className="contact-hero__copy">
              <p>
                よさこい楽曲制作は、チームのテーマ、演舞構成、制作時期、
                収録内容によって必要な工程が変わります。
              </p>
              <p>そのため、Web上で一律の料金表は掲載していません。</p>
              <p>
                年間の制作スケジュールは、継続してご依頼いただいているチームの制作を中心に組んでいます。
                新規のご依頼については、制作時期や内容を確認し、
                可能な範囲で制作枠を調整しています。
              </p>
            </div>
          </div>
        </section>

        <section className="contact-intro section">
          <div className="frame contact-intro__inner">
            <div className="contact-intro__lead">
              <p>
                新規に制作をご依頼いただくチーム様は、ご希望の時期に対応できない場合もございますので、
                できるだけお早めにご相談ください。
              </p>
              <p>
                お問い合わせの際は、演舞の予定時期、音源が必要となる時期、
                制作をご希望の内容に加え、チームの活動状況・チームカラーなど、
                できるだけ詳しい情報をお知らせください。
              </p>
              <p>
                また、過去に制作をご依頼いただいたチーム様につきましても、
                年度や時期によっては対応が難しい場合がございます。
                継続しての制作をご検討の場合も、お早めにご相談いただくことをおすすめいたします。
              </p>
            </div>
          </div>
        </section>

        <section
          className="contact-form-section section"
          aria-labelledby="contact-form-title"
        >
          <YosakoiHeroKinetics variant="contact" />
          <div className="frame contact-form-section__content">
            <div className="contact-form-section__heading">
              <p className="section-label">TELL US ABOUT THE PERFORMANCE</p>
              <h2 id="contact-form-title">制作希望の内容を送る</h2>
              <p className="contact-form-section__description">
                <span>
                  制作時期や対応可否を判断するため、演舞予定時期、音源が必要となる時期、
                </span>
                <span>
                  制作内容、チームや演舞のイメージなどを、できるだけ具体的にご記入ください。
                </span>
                <span>
                  未定の項目は、現段階での予定やご希望をお知らせください。
                </span>
              </p>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
