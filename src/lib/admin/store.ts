// Backend-agnostic content store for the admin panel. Pure logic on top of the
// chosen backend (GitHub in prod, local FS in dev). Horka is a single-page
// lead-gen site: the editable content is site settings, the homepage object,
// image focal points, and uploaded images. No product/category catalog.
import { getBackend } from "./backend";
import { PATHS, UPLOADS_DIR } from "./paths";
import type { Homepage, Site, ImageFocusMap } from "@/lib/types";

function toStr(v: unknown, fallback = ""): string {
  return v === undefined || v === null ? fallback : String(v);
}

// ---------- site & homepage (whole-object) ----------
export async function getSite(): Promise<Site> {
  return getBackend().readJSON<Site>(PATHS.site);
}
export async function putSite(obj: Site): Promise<unknown> {
  return getBackend().writeJSON(PATHS.site, obj, "admin: update site settings");
}
export async function getHomepage(): Promise<Homepage> {
  return getBackend().readJSON<Homepage>(PATHS.homepage);
}
// Merge-on-save: re-read the stored homepage and shallow-merge the incoming
// top-level sections over it, so a save that carries only some sections never
// clobbers the others (lost-update guard). The admin sends whole sections, so a
// shallow merge is exactly right — each provided section replaces its stored
// counterpart wholesale (arrays included), untouched sections are preserved.
export async function putHomepage(obj: Partial<Homepage>): Promise<unknown> {
  let current: Homepage | Record<string, unknown> = {};
  try {
    current = await getBackend().readJSON<Homepage>(PATHS.homepage);
  } catch {
    current = {};
  }
  const merged = { ...(current as Record<string, unknown>), ...(obj as Record<string, unknown>) };
  return getBackend().writeJSON(PATHS.homepage, merged, "admin: update homepage");
}

// ---------- image focal points (object-position map) ----------
// A non-destructive path -> CSS object-position map. The public build reads it
// through src/lib/data.ts (imageFocus()) and applies it wherever an image sits
// inside an object-cover cropping frame, so owners control which part shows.
const DEFAULT_FOCUS = "50% 50%";

export async function getImageFocus(): Promise<ImageFocusMap> {
  try {
    const map = await getBackend().readJSON<ImageFocusMap>(PATHS.imageFocus);
    return map && typeof map === "object" ? map : {};
  } catch {
    return {};
  }
}

// Re-reads the map and patches a single key (merge-on-save) so concurrent edits
// don't clobber. A centered/empty position deletes the key to keep the map lean.
export async function setImageFocus(path: string, position: string): Promise<ImageFocusMap> {
  const key = toStr(path).trim();
  if (!key) throw new Error("image path is required");
  const map = await getImageFocus();
  const pos = toStr(position).trim();
  if (!pos || pos === DEFAULT_FOCUS) {
    delete map[key];
  } else {
    map[key] = pos;
  }
  await getBackend().writeJSON(PATHS.imageFocus, map, `admin: set image focus ${key}`);
  return map;
}

// ---------- image uploads ----------
const EXT_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

function slugifyFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/\.[^.]+$/, "")
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50);
}

// payload: { base64, contentType, filename? }
// Stores under a UNIQUE name so a new upload never collides with an existing
// asset or a stale CDN copy. Returns the public path to store in the JSON.
export async function uploadImage(payload: {
  base64?: string;
  contentType?: string;
  filename?: string;
}): Promise<{ path: string; repoPath: string }> {
  const { base64, contentType, filename } = payload;
  if (!base64) throw new Error("Missing image data.");
  const ext = EXT_BY_TYPE[contentType || ""] || "jpg";
  const base = slugifyFilename(filename || "image") || "image";
  const unique = `${base}-${Date.now().toString(36)}.${ext}`;
  const repoPath = `${UPLOADS_DIR}/${unique}`;
  const publicPath = `/images/uploads/${unique}`;
  const buffer = Buffer.from(base64, "base64");
  await getBackend().writeBinary(repoPath, buffer, `admin: upload ${repoPath}`);
  return { path: publicPath, repoPath };
}
