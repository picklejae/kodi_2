import type { ButtonHTMLAttributes } from "react";
import { Button, TextLinkButton } from "@/design-system/kodi-design-system-ac5f73";

export function PillButton({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  // Legacy callers may place controls, but never re-skin the attached component.
  const placement = className?.split(/\s+/).filter((value) => /^(m[trblxy]?-|self-|flex-1$|hidden$|lg:hidden$)/.test(value)).join(" ");
  if (variant === "ghost") return <TextLinkButton {...p} className={placement} />;
  return <Button {...p} variant={variant === "outline" ? "secondary" : "primary"} fullWidth={!className?.includes("w-auto")} className={placement} />;
}
