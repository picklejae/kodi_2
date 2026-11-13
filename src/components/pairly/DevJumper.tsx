import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { usePairly } from "@/store/PairlyContext";
import { PRESETS, devButtonVisible, parsePresetParams } from "@/lib/devPresets";
import { SAMPLES } from "@/data/samples";
import { SCREEN_PATHS, type ScreenPath } from "@/lib/screenPaths";
import { DEFAULT_CODE, STYLE_TYPES, type StyleTypeCode } from "@/data/styleTypes";

const KEY = "pairly.devHidden";

export function DevJumper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadPreset, shopClicks, stylePreference, setStylePreference } = usePairly();
  const [allTypes, setAllTypes] = useState(false);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setVisible(devButtonVisible(window.location.search, localStorage.getItem(KEY)));
    const r = parsePresetParams(window.location.search);
    if (r) loadPreset(r);
    // Shortcut to bring it back after hiding: Shift+D
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "d" && !(e.target instanceof HTMLInputElement)) {
        localStorage.removeItem(KEY);
        setVisible(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!visible) return null;
  // Docked in the page gutter so it never sits over screen content: a narrow
  // vertical tab on the left edge on phone, the top-left corner from tablet up.
  return (
    <div className="fixed left-0 top-1/2 z-[100] -translate-y-1/2 text-xs md:left-2 md:top-2 md:translate-y-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="DEV menu"
        aria-expanded={open}
        className="flex h-touch w-[var(--spacing-screen)] items-center justify-center rounded-r bg-foreground/80 font-mono font-bold text-background opacity-60 [writing-mode:vertical-rl] hover:opacity-100 md:h-auto md:w-auto md:rounded md:px-2 md:py-1 md:[writing-mode:horizontal-tb]"
      >
        DEV
      </button>
      {open && (
        <div className="absolute left-full top-1/2 ml-1 w-48 -translate-y-1/2 rounded-lg border border-border bg-background p-1 shadow-lg md:left-0 md:top-full md:ml-0 md:mt-1 md:translate-y-0">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className="block w-full rounded px-2 py-1.5 text-left hover:bg-muted"
              onClick={() => {
                const sample = SAMPLES[0];
                if (sample) loadPreset({ preset: p.id, type: DEFAULT_CODE, sample });
                setOpen(false);
              }}
            >
              {p.label}
            </button>
          ))}
          <hr className="my-1 border-border" />
          <p className="px-2 py-1 text-muted-foreground">Screen Jump</p>
          {(Object.entries(SCREEN_PATHS) as [ScreenPath, string][]).map(([path, label]) => (
            <button key={path} className={`block w-full rounded px-2 py-1.5 text-left hover:bg-muted ${location.pathname === path ? "font-bold" : ""}`} onClick={() => { navigate({ to: path }); setOpen(false); }}>{label}</button>
          ))}
          <hr className="my-1 border-border" />
          {/* Every Style Passport (quiz result) for review: pick Men/Women, then a type. */}
          <button className="block w-full rounded px-2 py-1.5 text-left hover:bg-muted" aria-expanded={allTypes} onClick={() => setAllTypes((v) => !v)}>Style Passport · all 16 {allTypes ? "▾" : "▸"}</button>
          {allTypes && <div className="px-1 pb-1">
            <div className="mb-1 grid grid-cols-2 gap-1">
              {(["menswear", "womenswear"] as const).map((p) => <button key={p} className={`rounded border px-2 py-1 ${stylePreference === p ? "border-foreground font-bold" : "border-border"}`} onClick={() => setStylePreference(p)}>{p === "menswear" ? "Men" : "Women"}</button>)}
            </div>
            <div className="max-h-60 overflow-y-auto">
              {(Object.keys(STYLE_TYPES) as StyleTypeCode[]).map((code) => (
                <button key={code} className="block w-full rounded px-2 py-1 text-left hover:bg-muted" onClick={() => { const sample = SAMPLES[0]; if (sample) loadPreset({ preset: "reveal", type: code, sample }); setOpen(false); }}>
                  <span className="font-mono text-muted-foreground">{code}</span> {STYLE_TYPES[code].name}
                </button>
              ))}
            </div>
          </div>}
          <hr className="my-1 border-border" />
          <p className="px-2 py-1.5 text-muted-foreground">Shop taps: {shopClicks}</p>
          <button
            className="block w-full rounded px-2 py-1.5 text-left text-muted-foreground hover:bg-muted"
            onClick={() => {
              localStorage.setItem(KEY, "1");
              setVisible(false);
            }}
          >
            Hide DEV button (Shift+D to restore)
          </button>
        </div>
      )}
    </div>
  );
}
