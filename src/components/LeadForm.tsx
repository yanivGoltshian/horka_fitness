"use client";

import { useState } from "react";
import { site, whatsappLink, telLink } from "@/lib/data";

const GOALS = [
  "חיטוב וחיזוק",
  "בניית שריר וכוח",
  "ירידה במשקל",
  "שיקום וחזרה לפעילות",
  "בריאות וכושר כללי",
  "עדיין לא בטוחים",
];

export default function LeadForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    goal: "",
    time: "",
    message: "",
  });

  function buildText() {
    const lines = [
      "היי, אשמח לקבוע אימון ניסיון בסטודיו הורקה 🙂",
      form.name && `שם: ${form.name}`,
      form.phone && `טלפון: ${form.phone}`,
      form.goal && `מטרה: ${form.goal}`,
      form.time && `זמן מועדף: ${form.time}`,
      form.message && `הערות: ${form.message}`,
    ].filter(Boolean);
    return lines.join("\n");
  }

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const inputCls =
    "w-full rounded-xl border border-border bg-white px-4 py-3 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        window.open(whatsappLink(buildText()), "_blank");
      }}
      className="grid gap-4"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1.5">שם מלא</label>
          <input className={inputCls} value={form.name} onChange={set("name")} placeholder="השם שלך" required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">טלפון</label>
          <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="050-0000000" type="tel" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium mb-1.5">המטרה שלך</label>
          <select className={inputCls} value={form.goal} onChange={set("goal")}>
            <option value="">בחרו מטרה…</option>
            {GOALS.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">זמן מועדף לאימון</label>
          <input className={inputCls} value={form.time} onChange={set("time")} placeholder="לדוגמה: בקרים / אחה״צ" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">משהו שנשמח לדעת מראש</label>
        <textarea className={inputCls} rows={3} value={form.message} onChange={set("message")} placeholder="ניסיון קודם, מגבלות, שאלות…" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-eco px-6 py-3.5 font-semibold text-white hover:bg-eco-dark transition"
        >
          לתיאום אימון ניסיון בוואטסאפ
        </button>
        <a
          href={telLink(site.phone)}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-6 py-3.5 font-semibold hover:border-brand hover:text-brand transition"
        >
          חיוג לסטודיו
        </a>
      </div>
      <p className="text-xs text-muted">הפרטים נשלחים ישירות אלינו לוואטסאפ – ללא שמירה במאגר.</p>
    </form>
  );
}
