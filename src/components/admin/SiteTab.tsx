"use client";

import React from "react";
import type { Site } from "@/lib/types";
import { getSite, putSite } from "@/lib/admin/client";
import { Button, Field, Input, Textarea, ListEditor, Spinner, type ToastState } from "./ui";

export default function SiteTab({ toast }: { toast: (t: ToastState) => void }) {
  const [site, setSite] = React.useState<Site | null>(null);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    getSite()
      .then(setSite)
      .catch((e) => toast({ msg: (e as Error).message, kind: "err" }));
  }, [toast]);

  if (!site) return <Spinner />;

  const set = <K extends keyof Site>(k: K, v: Site[K]) => setSite({ ...site, [k]: v });

  async function save() {
    if (!site) return;
    setSaving(true);
    try {
      await putSite(site);
      toast({ msg: "פרטי הסטודיו נשמרו ✓", kind: "ok" });
    } catch (e) {
      toast({ msg: (e as Error).message, kind: "err" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="שם הסטודיו">
        <Input value={site.name} onChange={(e) => set("name", e.target.value)} />
      </Field>
      <Field label="שם באנגלית">
        <Input dir="ltr" value={site.legalName} onChange={(e) => set("legalName", e.target.value)} />
      </Field>
      <Field label="סלוגן">
        <Input value={site.tagline} onChange={(e) => set("tagline", e.target.value)} />
      </Field>
      <Field label="תיאור (SEO)">
        <Textarea value={site.description} onChange={(e) => set("description", e.target.value)} />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="טלפון">
          <Input dir="ltr" value={site.phone} onChange={(e) => set("phone", e.target.value)} />
        </Field>
        <Field label="וואטסאפ" hint="פורמט בינלאומי ללא + , למשל 972543453662">
          <Input dir="ltr" value={site.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
        </Field>
        <Field label="אימייל">
          <Input dir="ltr" type="email" value={site.email} onChange={(e) => set("email", e.target.value)} />
        </Field>
        <Field label="אינסטגרם" hint="קישור מלא לפרופיל">
          <Input dir="ltr" value={site.instagram} onChange={(e) => set("instagram", e.target.value)} />
        </Field>
        <Field label="כתובת">
          <Input value={site.address} onChange={(e) => set("address", e.target.value)} />
        </Field>
        <Field label="עיר">
          <Input value={site.city} onChange={(e) => set("city", e.target.value)} />
        </Field>
      </div>

      <Field label="הודעת וואטסאפ מוכנה מראש" hint="הטקסט שנשלח כשלוחצים על כפתור הוואטסאפ">
        <Textarea value={site.whatsappText} onChange={(e) => set("whatsappText", e.target.value)} />
      </Field>

      <Field label="שעות פעילות">
        <Input value={site.hours} onChange={(e) => set("hours", e.target.value)} />
      </Field>

      <ListEditor
        label="תגיות / יתרונות"
        hint="מופיעות בכותרת התחתונה ובאזור ההירו · פריט אחד בכל שורה"
        value={site.certifications}
        onChange={(v) => set("certifications", v)}
      />

      <div className="sticky bottom-0 -mx-3 border-t border-[#e6e2d8] bg-white/95 px-3 py-3 backdrop-blur sm:static sm:mx-0 sm:border-0 sm:bg-transparent sm:p-0">
        <Button onClick={save} disabled={saving} className="w-full sm:w-auto">
          {saving ? "שומר…" : "שמירת פרטי הסטודיו"}
        </Button>
      </div>
    </div>
  );
}
