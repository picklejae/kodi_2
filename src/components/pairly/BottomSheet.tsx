import type { ReactNode } from "react";
import { X } from "lucide-react";

export function BottomSheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex justify-center" role="dialog" aria-label={title}>
      <div className="relative flex w-full max-w-sheet flex-col justify-end">
        <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-foreground/30 animate-in fade-in" />
        <div className="relative max-h-[88vh] overflow-y-auto rounded-t-3xl bg-background px-6 pb-8 pt-3 shadow-soft animate-in slide-in-from-bottom duration-300">
          <div className="mx-auto h-1 w-10 rounded-full bg-border" />
          <div className="mt-3 flex items-center justify-between">
            <h2 className="font-serif text-2xl">{title}</h2>
            <button onClick={onClose} aria-label="Close sheet" className="-mr-2 p-2"><X className="h-5 w-5" /></button>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
