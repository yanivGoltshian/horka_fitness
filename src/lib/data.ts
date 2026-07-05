import homepageJson from "@/data/homepage.json";
import siteJson from "@/data/site.json";
import imageFocusJson from "@/data/imageFocus.json";
import type { Homepage, Site, ImageFocusMap } from "./types";

export const site = siteJson as Site;
export const homepage = homepageJson as Homepage;
export const imageFocusMap = imageFocusJson as ImageFocusMap;

// CSS object-position for an image inside a cropping (object-cover) frame.
// Owners set this per image in the admin "framing" editor; defaults to centered.
export function imageFocus(path: string): string {
  return (path && imageFocusMap[path]) || "50% 50%";
}

// Builds a WhatsApp deep link to the studio, optionally with a prefilled message.
export function whatsappLink(text?: string): string {
  const base = `https://wa.me/${site.whatsapp}`;
  const msg = text ?? site.whatsappText;
  return msg ? `${base}?text=${encodeURIComponent(msg)}` : base;
}

export function telLink(phone: string): string {
  return `tel:${phone.replace(/[^0-9+]/g, "")}`;
}
