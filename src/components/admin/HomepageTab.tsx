"use client";

import React from "react";
import type { Homepage, Advantage, Step, Stat, Testimonial } from "@/lib/types";
import { getHomepage, putHomepage } from "@/lib/admin/client";
import { Button, Field, Input, Textarea, ImageUpload, ListEditor, Spinner, type ToastState } from "./ui";
import { FramingButton } from "./FramingButton";

// Frames matching the EXACT aspect-ratios the public homepage uses, so the
// focal-point previews are truthful. hero + intro = portrait 4:5,
// gallery tiles = portrait 3:4, cube faces = square.
const FRAME_HERO = "4 / 5";
const FRAME_GALLERY = "3 / 4";
const FRAME_CUBE = "1 / 1";

// A collapsible section in EXACT on-site order, with a Hebrew hint sub-label.
function Section({
  title,
  hint,
  defaultOpen = false,
  children,
}: {
  title: string;
  hint?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  return (
    <details
      open={defaultOpen}
      className="group rounded-2xl border border-[#e6e2d8] bg-white shadow-sm"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-[#1f2224]">{title}</p>
          {hint ? <p className="truncate text-xs text-[#6b6f6a]">{hint}</p> : null}
        </div>
        <span className="shrink-0 text-[#6b6f6a] transition group-open:rotate-180">▾</span>
      </summary>
      <div className="space-y-4 border-t border-[#e6e2d8] px-4 py-4">{children}</div>
    </details>
  );
}

// A multi-image field: each image gets a 🎯 focal-point button + ✕ remove,
// plus an "add image" uploader that appends to the array. `frame` sets the
// preview crop; every image path keys the focus map.
function GalleryField({
  label,
  hint,
  images,
  frame,
  onChange,
  onBusy,
}: {
  label: string;
  hint?: string;
  images: string[];
  frame: string;
  onChange: (next: string[]) => void;
  onBusy?: (b: boolean) => void;
}) {
  return (
    <div>
      <span className="mb-1 block text-sm font-semibold text-[#1f2224]">{label}</span>
      {hint ? <p className="mb-2 text-xs text-[#6b6f6a]">{hint}</p> : null}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {images.map((src, i) => (
          <div key={`${src}-${i}`} className="group relative">
            <div
              className="relative w-full overflow-hidden rounded-xl border border-[#e6e2d8] bg-[#faf8f3]"
              style={{ aspectRatio: frame }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
            <div className="absolute inset-x-1 bottom-1 flex items-center justify-between">
              <FramingButton src={src} path={src} frame={frame} compact />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, j) => j !== i))}
                title="הסרה"
                aria-label="הסרת התמונה"
                className="grid h-8 w-8 place-items-center rounded-full bg-black/60 text-sm text-white hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3">
        <ImageUpload
          label="הוספת תמונה"
          value=""
          kind="wide"
          frame={frame}
          framing={false}
          onBusy={onBusy}
          onUploaded={(path) => onChange([...images, path])}
        />
      </div>
    </div>
  );
}

export default function HomepageTab({ toast }: { toast: (t: ToastState) => void }) {
  const [hp, setHp] = React.useState<Homepage | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [uploading, setUploading] = React.useState(false);

  React.useEffect(() => {
    getHomepage()
      .then(setHp)
      .catch((e) => toast({ msg: (e as Error).message, kind: "err" }));
  }, [toast]);

  if (!hp) return <Spinner />;

  // Immutable section updater keeps nested edits terse.
  const patch = <K extends keyof Homepage>(k: K, v: Homepage[K]) => setHp({ ...hp, [k]: v });

  async function save() {
    if (!hp) return;
    setSaving(true);
    try {
      await putHomepage(hp);
      toast({ msg: "עמוד הבית נשמר ✓", kind: "ok" });
    } catch (e) {
      toast({ msg: (e as Error).message, kind: "err" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* HERO */}
      <Section title="אזור פתיחה (Hero)" hint="הכותרת הראשית, תת‑כותרת, תמונה וכפתורים" defaultOpen>
        <Field label="תווית עליונה">
          <Input value={hp.hero.eyebrow} onChange={(e) => patch("hero", { ...hp.hero, eyebrow: e.target.value })} />
        </Field>
        <Field label="כותרת ראשית">
          <Input value={hp.hero.title} onChange={(e) => patch("hero", { ...hp.hero, title: e.target.value })} />
        </Field>
        <Field label="תת‑כותרת">
          <Textarea value={hp.hero.subtitle} onChange={(e) => patch("hero", { ...hp.hero, subtitle: e.target.value })} />
        </Field>
        <ImageUpload
          label="תמונת פתיחה"
          value={hp.hero.image}
          kind="wide"
          frame={FRAME_HERO}
          onBusy={setUploading}
          onUploaded={(path) => patch("hero", { ...hp.hero, image: path })}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="כפתור ראשי — טקסט">
            <Input
              value={hp.hero.ctaPrimary.label}
              onChange={(e) => patch("hero", { ...hp.hero, ctaPrimary: { ...hp.hero.ctaPrimary, label: e.target.value } })}
            />
          </Field>
          <Field label="כפתור ראשי — קישור" hint="למשל #contact או tel:0543453662">
            <Input
              dir="ltr"
              value={hp.hero.ctaPrimary.href}
              onChange={(e) => patch("hero", { ...hp.hero, ctaPrimary: { ...hp.hero.ctaPrimary, href: e.target.value } })}
            />
          </Field>
          <Field label="כפתור משני — טקסט">
            <Input
              value={hp.hero.ctaSecondary.label}
              onChange={(e) => patch("hero", { ...hp.hero, ctaSecondary: { ...hp.hero.ctaSecondary, label: e.target.value } })}
            />
          </Field>
          <Field label="כפתור משני — קישור">
            <Input
              dir="ltr"
              value={hp.hero.ctaSecondary.href}
              onChange={(e) => patch("hero", { ...hp.hero, ctaSecondary: { ...hp.hero.ctaSecondary, href: e.target.value } })}
            />
          </Field>
        </div>
      </Section>

      {/* ANNOUNCEMENT */}
      <Section title="פס הודעה" hint="הרצועה שמופיעה מתחת לאזור הפתיחה">
        <Field label="טקסט ההודעה">
          <Textarea value={hp.announcement} onChange={(e) => patch("announcement", e.target.value)} />
        </Field>
      </Section>

      {/* ADVANTAGES */}
      <Section title="יתרונות" hint="הכרטיסים עם האייקונים">
        <ArrayEditor
          items={hp.advantages}
          onChange={(v) => patch("advantages", v)}
          addLabel="הוספת יתרון"
          create={(): Advantage => ({ icon: "⭐", title: "", text: "" })}
          render={(item, upd) => (
            <>
              <div className="grid grid-cols-[5rem_1fr] gap-3">
                <Field label="אייקון">
                  <Input value={item.icon || ""} onChange={(e) => upd({ ...item, icon: e.target.value })} />
                </Field>
                <Field label="כותרת">
                  <Input value={item.title} onChange={(e) => upd({ ...item, title: e.target.value })} />
                </Field>
              </div>
              <Field label="טקסט">
                <Textarea value={item.text} onChange={(e) => upd({ ...item, text: e.target.value })} />
              </Field>
            </>
          )}
        />
      </Section>

      {/* INTRO */}
      <Section title="קצת עלינו" hint="הטקסט והתמונה של אזור ה‑About">
        <Field label="תווית עליונה">
          <Input value={hp.intro.eyebrow} onChange={(e) => patch("intro", { ...hp.intro, eyebrow: e.target.value })} />
        </Field>
        <Field label="כותרת">
          <Input value={hp.intro.title} onChange={(e) => patch("intro", { ...hp.intro, title: e.target.value })} />
        </Field>
        <Field label="משפט פתיחה">
          <Textarea value={hp.intro.lead} onChange={(e) => patch("intro", { ...hp.intro, lead: e.target.value })} />
        </Field>
        <ListEditor
          label="פסקאות"
          value={hp.intro.paragraphs}
          onChange={(v) => patch("intro", { ...hp.intro, paragraphs: v })}
        />
        <ImageUpload
          label="תמונה"
          value={hp.intro.image}
          kind="wide"
          frame={FRAME_HERO}
          onBusy={setUploading}
          onUploaded={(path) => patch("intro", { ...hp.intro, image: path })}
        />
      </Section>

      {/* HOW IT WORKS */}
      <Section title="איך מתחילים" hint="הכותרת וארבעת השלבים">
        <Field label="תווית עליונה">
          <Input value={hp.howItWorks.eyebrow} onChange={(e) => patch("howItWorks", { ...hp.howItWorks, eyebrow: e.target.value })} />
        </Field>
        <Field label="כותרת">
          <Input value={hp.howItWorks.title} onChange={(e) => patch("howItWorks", { ...hp.howItWorks, title: e.target.value })} />
        </Field>
        <Field label="טקסט">
          <Textarea value={hp.howItWorks.text} onChange={(e) => patch("howItWorks", { ...hp.howItWorks, text: e.target.value })} />
        </Field>
        <ArrayEditor
          items={hp.howItWorks.steps}
          onChange={(v) => patch("howItWorks", { ...hp.howItWorks, steps: v })}
          addLabel="הוספת שלב"
          create={(): Step => ({ title: "", text: "" })}
          render={(item, upd) => (
            <>
              <Field label="כותרת השלב">
                <Input value={item.title} onChange={(e) => upd({ ...item, title: e.target.value })} />
              </Field>
              <Field label="טקסט">
                <Textarea value={item.text} onChange={(e) => upd({ ...item, text: e.target.value })} />
              </Field>
            </>
          )}
        />
      </Section>

      {/* STATS */}
      <Section title="נתונים" hint="רצועת המספרים/דגשים">
        <ArrayEditor
          items={hp.stats}
          onChange={(v) => patch("stats", v)}
          addLabel="הוספת נתון"
          create={(): Stat => ({ value: "", label: "" })}
          render={(item, upd) => (
            <div className="grid grid-cols-2 gap-3">
              <Field label="ערך">
                <Input value={item.value} onChange={(e) => upd({ ...item, value: e.target.value })} />
              </Field>
              <Field label="תיאור">
                <Input value={item.label} onChange={(e) => upd({ ...item, label: e.target.value })} />
              </Field>
            </div>
          )}
        />
      </Section>

      {/* GALLERY */}
      <Section title="גלריה" hint="רשת התמונות · לחצו 🎯 לבחירת מיקוד במסגרת">
        <Field label="תווית עליונה">
          <Input value={hp.gallery.eyebrow} onChange={(e) => patch("gallery", { ...hp.gallery, eyebrow: e.target.value })} />
        </Field>
        <Field label="כותרת">
          <Input value={hp.gallery.title} onChange={(e) => patch("gallery", { ...hp.gallery, title: e.target.value })} />
        </Field>
        <Field label="טקסט">
          <Textarea value={hp.gallery.text} onChange={(e) => patch("gallery", { ...hp.gallery, text: e.target.value })} />
        </Field>
        <GalleryField
          label="תמונות הגלריה"
          hint="מוצגות במסגרת לאורך (3:4)"
          images={hp.gallery.images}
          frame={FRAME_GALLERY}
          onBusy={setUploading}
          onChange={(v) => patch("gallery", { ...hp.gallery, images: v })}
        />
      </Section>

      {/* CUBE */}
      <Section title="קובייה מסתובבת" hint="שש תמונות · מוצגות בריבוע (1:1)">
        <Field label="תווית עליונה">
          <Input value={hp.cube.eyebrow} onChange={(e) => patch("cube", { ...hp.cube, eyebrow: e.target.value })} />
        </Field>
        <Field label="כותרת">
          <Input value={hp.cube.title} onChange={(e) => patch("cube", { ...hp.cube, title: e.target.value })} />
        </Field>
        <Field label="טקסט">
          <Textarea value={hp.cube.text} onChange={(e) => patch("cube", { ...hp.cube, text: e.target.value })} />
        </Field>
        <GalleryField
          label="תמונות הקובייה"
          hint="מומלץ 6 תמונות"
          images={hp.cube.images}
          frame={FRAME_CUBE}
          onBusy={setUploading}
          onChange={(v) => patch("cube", { ...hp.cube, images: v })}
        />
      </Section>

      {/* TESTIMONIALS */}
      <Section title="ההבטחה שלנו" hint="ציטוטים">
        <Field label="תווית עליונה">
          <Input value={hp.testimonials.eyebrow} onChange={(e) => patch("testimonials", { ...hp.testimonials, eyebrow: e.target.value })} />
        </Field>
        <Field label="כותרת">
          <Input value={hp.testimonials.title} onChange={(e) => patch("testimonials", { ...hp.testimonials, title: e.target.value })} />
        </Field>
        <ArrayEditor
          items={hp.testimonials.items}
          onChange={(v) => patch("testimonials", { ...hp.testimonials, items: v })}
          addLabel="הוספת ציטוט"
          create={(): Testimonial => ({ quote: "", author: "סטודיו הורקה" })}
          render={(item, upd) => (
            <>
              <Field label="ציטוט">
                <Textarea value={item.quote} onChange={(e) => upd({ ...item, quote: e.target.value })} />
              </Field>
              <Field label="שם">
                <Input value={item.author} onChange={(e) => upd({ ...item, author: e.target.value })} />
              </Field>
            </>
          )}
        />
      </Section>

      {/* FAQ */}
      <Section title="שאלות ותשובות" hint="האקורדיון בתחתית העמוד">
        <ArrayEditor
          items={hp.faq || []}
          onChange={(v) => patch("faq", v)}
          addLabel="הוספת שאלה"
          create={() => ({ q: "", a: "" })}
          render={(item, upd) => (
            <>
              <Field label="שאלה">
                <Input value={item.q} onChange={(e) => upd({ ...item, q: e.target.value })} />
              </Field>
              <Field label="תשובה">
                <Textarea value={item.a} onChange={(e) => upd({ ...item, a: e.target.value })} />
              </Field>
            </>
          )}
        />
      </Section>

      <div className="sticky bottom-0 -mx-3 border-t border-[#e6e2d8] bg-white/95 px-3 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button onClick={save} disabled={saving || uploading} className="w-full sm:w-auto">
          {saving ? "שומר…" : uploading ? "ממתין לסיום העלאה…" : "שמירת עמוד הבית"}
        </Button>
      </div>
    </div>
  );
}

// Generic add/remove/reorder editor for an array of like items. Each item is
// rendered in a bordered card with a ✕ remove; a footer button appends a new
// blank item via `create`.
function ArrayEditor<T>({
  items,
  onChange,
  create,
  render,
  addLabel,
}: {
  items: T[];
  onChange: (next: T[]) => void;
  create: () => T;
  render: (item: T, update: (next: T) => void) => React.ReactNode;
  addLabel: string;
}) {
  const list = items || [];
  const update = (i: number, next: T) => onChange(list.map((it, j) => (j === i ? next : it)));
  const remove = (i: number) => onChange(list.filter((_, j) => j !== i));
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= list.length) return;
    const next = [...list];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  return (
    <div className="space-y-3">
      {list.map((item, i) => (
        <div key={i} className="rounded-xl border border-[#e6e2d8] bg-[#faf8f3] p-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6b6f6a]">#{i + 1}</span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="הזזה למעלה"
                className="grid h-8 w-8 place-items-center rounded-lg bg-black/5 text-sm disabled:opacity-30"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === list.length - 1}
                aria-label="הזזה למטה"
                className="grid h-8 w-8 place-items-center rounded-lg bg-black/5 text-sm disabled:opacity-30"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(i)}
                aria-label="הסרה"
                className="grid h-8 w-8 place-items-center rounded-lg bg-black/5 text-sm text-red-600 hover:bg-red-50"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="space-y-3">{render(item, (next) => update(i, next))}</div>
        </div>
      ))}
      <Button variant="secondary" onClick={() => onChange([...list, create()])} className="w-full">
        + {addLabel}
      </Button>
    </div>
  );
}
