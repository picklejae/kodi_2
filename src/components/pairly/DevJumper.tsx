import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { usePairly } from "@/store/PairlyContext";
import { PRESETS, devButtonVisible, parsePresetParams } from "@/lib/devPresets";
import { SAMPLES } from "@/data/samples";
import { DEFAULT_CODE } from "@/data/styleTypes";

const KEY = "pairly.devHidden";

export function DevJumper() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadPreset, shopClicks } = usePairly();
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
  return (
    <div className="fixed left-2 top-2 z-[100] text-xs">
      <button
        onClick={() => setOpen((o) => !o)}
        className="rounded-md bg-foreground/80 px-2 py-1 font-mono font-bold text-background opacity-60 hover:opacity-100"
      >
        DEV
      </button>
      {open && (
        <div className="mt-1 w-48 rounded-lg border border-border bg-background p-1 shadow-lg">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              className="block w-full rounded px-2 py-1.5 text-left hover:bg-muted"
              onClick={() => {
                const sample = SAMPLES[0];
                if (sample) loadPreset({ preset: p.id, type: DEFAULT_CODE, sample });
                if (location.pathname !== "/") navigate({ to: "/" });
                setOpen(false);
              }}
            >
              {p.label}
            </button>
          ))}
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
