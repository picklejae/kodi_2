import type { GeneratedLook, StylePlan, StylePreference } from "./styleGeneration";
import type { StyleTypeCode } from "@/data/styleTypes";

export const STYLE_CACHE_LIMIT = 20;
export const STYLE_CACHE_DB = "pairly-style-results";
const STORE = "results";
export interface CachedStyleResult {
  key: string;
  plan: StylePlan;
  /** Only successful looks are persisted; missing slots are rebuilt from the plan for explicit retry. */
  looks: GeneratedLook[];
  createdAt: number;
}
export interface StyleCacheInputs {
  imageIdentity: string;
  preference: StylePreference;
  styleType: StyleTypeCode;
  occasion: string;
  mood: string;
  body: string;
  axisScores: number[];
  category: string;
  name: string;
}
export function styleCacheKey(input: StyleCacheInputs): string {
  return JSON.stringify([input.imageIdentity, input.preference, input.styleType, input.occasion, input.mood.trim(), input.body, input.axisScores, input.category, input.name]);
}
export async function hashImageBytes(bytes: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}
export async function originalImageIdentity(image: string, sampleId?: string): Promise<string> {
  if (sampleId) return sampleId;
  const response = await fetch(image);
  if (!response.ok) throw new Error("Couldn't read your original photo. Please select it again.");
  return hashImageBytes(await response.arrayBuffer());
}
export function generationBody(body: { heightCm: number | null; weightKg: number | null }): string {
  return body.heightCm && body.weightKg ? `approximately ${Math.round(body.heightCm)} cm tall and ${Math.round(body.weightKg)} kg` : "";
}
export function bypassStyleCache(search: string): boolean {
  return new URLSearchParams(search).get("nocache") === "1";
}
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(STYLE_CACHE_DB, 1);
    request.onupgradeneeded = () => { request.result.createObjectStore(STORE, { keyPath: "key" }); };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    request.onblocked = () => reject(new Error("Style cache is unavailable"));
  });
}
export async function readStyleCache(key: string): Promise<CachedStyleResult | null> {
  let db: IDBDatabase | undefined;
  try {
    db = await openDatabase();
    return await new Promise((resolve, reject) => {
      const request = db?.transaction(STORE, "readonly").objectStore(STORE).get(key);
      if (!request) { resolve(null); return; }
      request.onsuccess = () => resolve((request.result as CachedStyleResult | undefined) ?? null);
      request.onerror = () => reject(request.error);
    });
  } catch { return null; } finally { db?.close(); }
}
export async function writeStyleCache(entry: CachedStyleResult): Promise<void> {
  const looks = entry.looks.filter((look) => look.status === "success" && look.image);
  if (!looks.length) return;
  let db: IDBDatabase | undefined;
  try {
    db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const transaction = db?.transaction(STORE, "readwrite");
      if (!transaction) { resolve(); return; }
      const store = transaction.objectStore(STORE);
      store.put({ ...entry, looks });
      const request = store.getAll();
      request.onsuccess = () => {
        const entries = request.result as CachedStyleResult[];
        entries.sort((a, b) => a.createdAt - b.createdAt);
        entries.slice(0, Math.max(0, entries.length - STYLE_CACHE_LIMIT)).forEach((old) => store.delete(old.key));
      };
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
      transaction.onabort = () => reject(transaction.error);
    });
  } catch { /* Browser storage is optional; successful looks still stay in shared state. */ } finally { db?.close(); }
}