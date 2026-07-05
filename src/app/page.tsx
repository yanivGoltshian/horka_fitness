import Image from "next/image";
import { homepage, site, whatsappLink, telLink, imageFocus } from "@/lib/data";
import { asset } from "@/lib/asset";
import ProductCube from "@/components/ProductCube";
import LeadForm from "@/components/LeadForm";
import JsonLd from "@/components/JsonLd";
import SocialButtons from "@/components/SocialButtons";
import { faqPageLd } from "@/lib/structured-data";

const h = homepage;

export default function Home() {
  return (
    <>
      {h.faq && h.faq.length > 0 && <JsonLd data={faqPageLd(h.faq)} />}

      {/* ===== HERO ===== */}
      <section id="top" className="relative hero-glow text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 pt-16 pb-20 sm:pt-20 sm:pb-28 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs sm:text-sm text-white/85">
              {h.hero.eyebrow}
            </span>
            <h1 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05]">
              {h.hero.title}
            </h1>
            <p className="mt-5 max-w-xl text-base sm:text-lg leading-relaxed text-white/80">
              {h.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-eco px-7 py-3.5 font-semibold text-white shadow-lg shadow-black/20 hover:bg-eco-dark transition"
              >
                {h.hero.ctaPrimary.label}
              </a>
              <a
                href={telLink(site.phone)}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-7 py-3.5 font-semibold text-white hover:bg-white/10 transition"
              >
                {h.hero.ctaSecondary.label}
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
              {site.certifications.slice(0, 3).map((c) => (
                <span key={c} className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  {c}
                </span>
              ))}
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:120ms]">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-2xl">
              <Image
                src={asset(h.hero.image)}
                alt={site.name}
                fill
                sizes="(max-width:1024px) 100vw, 40vw"
                className="object-cover"
                style={{ objectPosition: imageFocus(h.hero.image) }}
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* announcement */}
      {h.announcement && (
        <div className="bg-brand text-white text-center text-sm sm:text-[15px] px-4 py-3 font-medium">
          {h.announcement}
        </div>
      )}

      {/* ===== ADVANTAGES ===== */}
      <section id="advantages" className="py-16 sm:py-24 bg-cream">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-eco-dark font-semibold text-sm tracking-wide">היתרון של הורקה</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">למה מתאמנים בוחרים בנו</h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.advantages.map((a) => (
              <div key={a.title} className="card-elegant rounded-2xl bg-surface p-6 border border-border/70 hover:-translate-y-1 transition">
                <div className="text-3xl">{a.icon}</div>
                <h3 className="mt-4 font-display text-lg font-bold">{a.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{a.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTRO / ABOUT ===== */}
      <section id="about" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative order-1 lg:order-none">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-[2rem] overflow-hidden ring-1 ring-border shadow-xl">
              <Image
                src={asset(h.intro.image)}
                alt={h.intro.title}
                fill
                sizes="(max-width:1024px) 100vw, 45vw"
                className="object-cover"
                style={{ objectPosition: imageFocus(h.intro.image) }}
              />
            </div>
          </div>
          <div>
            <p className="text-eco-dark font-semibold text-sm tracking-wide">{h.intro.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold leading-tight">{h.intro.title}</h2>
            <p className="mt-4 text-lg font-medium text-foreground/90">{h.intro.lead}</p>
            {h.intro.paragraphs.map((p, i) => (
              <p key={i} className="mt-4 leading-relaxed text-muted">{p}</p>
            ))}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-dark transition"
            >
              דברו איתנו בוואטסאפ
            </a>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how" className="py-16 sm:py-24 bg-ink text-white">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-gold font-semibold text-sm tracking-wide">{h.howItWorks.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{h.howItWorks.title}</h2>
            <p className="mt-3 text-white/70">{h.howItWorks.text}</p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {h.howItWorks.steps.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-white/12 bg-white/5 p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-eco font-display text-lg font-bold text-white">
                  {i + 1}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-white">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/70">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-14 bg-cream-2">
        <div className="mx-auto max-w-6xl px-4 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {h.stats.map((s) => (
            <div key={s.label}>
              <div className="font-display text-4xl sm:text-5xl font-black text-brand">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== GALLERY ===== */}
      <section id="gallery" className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-eco-dark font-semibold text-sm tracking-wide">{h.gallery.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{h.gallery.title}</h2>
            <p className="mt-3 text-muted">{h.gallery.text}</p>
          </div>
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {h.gallery.images.map((src, i) => (
              <div key={src} className="relative aspect-[3/4] rounded-2xl overflow-hidden ring-1 ring-border group">
                <Image
                  src={asset(src)}
                  alt={`${site.name} – ${i + 1}`}
                  fill
                  sizes="(max-width:640px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  style={{ objectPosition: imageFocus(src) }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CUBE ===== */}
      <section className="py-16 sm:py-24 bg-ink text-white overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-none">
            <ProductCube images={h.cube.images} />
          </div>
          <div className="order-1 lg:order-none text-center lg:text-right">
            <p className="text-gold font-semibold text-sm tracking-wide">{h.cube.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{h.cube.title}</h2>
            <p className="mt-3 text-white/70 max-w-md mx-auto lg:mx-0">{h.cube.text}</p>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-eco px-6 py-3 font-semibold text-white hover:bg-eco-dark transition"
            >
              לתיאום ביקור בסטודיו
            </a>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-16 sm:py-24 bg-cream">
        <div className="mx-auto max-w-6xl px-4">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-eco-dark font-semibold text-sm tracking-wide">{h.testimonials.eyebrow}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">{h.testimonials.title}</h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {h.testimonials.items.map((t, i) => (
              <figure key={i} className="card-elegant rounded-2xl bg-surface p-7 border border-border/70">
                <div className="font-display text-4xl leading-none text-gold">”</div>
                <blockquote className="mt-3 leading-relaxed text-foreground/90">{t.quote}</blockquote>
                <figcaption className="mt-4 text-sm font-semibold text-muted">— {t.author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      {h.faq && h.faq.length > 0 && (
        <section id="faq" className="py-16 sm:py-24">
          <div className="mx-auto max-w-3xl px-4">
            <div className="text-center">
              <p className="text-eco-dark font-semibold text-sm tracking-wide">שאלות נפוצות</p>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">כל מה שרציתן לדעת</h2>
            </div>
            <div className="mt-10 divide-y divide-border rounded-2xl border border-border bg-surface">
              {h.faq.map((f) => (
                <details key={f.q} className="group px-5 py-4">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 font-semibold list-none">
                    <span>{f.q}</span>
                    <span className="shrink-0 text-gold transition-transform group-open:rotate-45 text-xl leading-none">+</span>
                  </summary>
                  <p className="mt-3 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===== CONTACT ===== */}
      <section id="contact" className="py-16 sm:py-24 bg-cream-2">
        <div className="mx-auto max-w-6xl px-4 grid lg:grid-cols-2 gap-10 lg:gap-14">
          <div>
            <p className="text-eco-dark font-semibold text-sm tracking-wide">צרו קשר</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold">מתחילים באימון ניסיון</h2>
            <p className="mt-3 leading-relaxed text-muted">
              משאירים פרטים ונחזור אליכם לתיאום אימון ניסיון ללא התחייבות. אפשר גם להתקשר או לשלוח וואטסאפ ישירות.
            </p>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <span className="text-eco-dark">כתובת:</span>
                <a
                  href={`https://waze.com/ul?q=${encodeURIComponent(`${site.address} ${site.city}`)}&navigate=yes`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium hover:text-brand transition"
                >
                  {site.address}, {site.city}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-eco-dark">טלפון:</span>
                <a href={telLink(site.phone)} className="font-medium hover:text-brand transition">{site.phone}</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-eco-dark">שעות:</span>
                <span className="font-medium">{site.hours}</span>
              </div>
            </div>

            <SocialButtons className="mt-6" variant="light" />

            <div className="mt-8 overflow-hidden rounded-2xl ring-1 ring-border">
              <iframe
                title="מפה"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(`${site.address} ${site.city}`)}&output=embed`}
                className="w-full h-64"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          <div className="card-elegant rounded-3xl bg-surface p-6 sm:p-8 border border-border/70">
            <h3 className="font-display text-xl font-bold">השאירו פרטים</h3>
            <p className="mt-1 text-sm text-muted">נחזור אליכם בהקדם 🙂</p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
