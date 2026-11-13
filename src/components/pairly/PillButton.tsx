import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";
import { Button, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

export function PillButton({ variant = "primary", accent = false, className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost"; accent?: boolean }) {
  // Legacy callers may place controls, but never re-skin the attached component.
  const placement = className?.split(/\s+/).flatMap((value) => {
    if (/^(self-|flex-1$|hidden$|lg:hidden$)/.test(value)) return [value];
    const margin = value.match(/^(m[trblxy]?)-/);
    return margin ? [`${margin[1]}-screen`] : [];
  }).join(" ");
  if (variant === "ghost") return <TextLinkButton {...p} className={placement} />;
  return <Button {...p} variant={variant === "outline" ? "secondary" : "primary"} fullWidth={!className?.includes("w-auto")} className={cn(placement, variant === "primary" && "capitalize", accent && variant === "primary" && "bg-[#812F46]")} />;
}
