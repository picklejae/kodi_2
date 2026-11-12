import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function PillButton({ variant = "primary", className, ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "outline" | "ghost" }) {
  return (
    <button
      {...p}
      className={cn(
        "inline-flex h-12 w-full items-center justify-center rounded-full px-6 text-sm font-semibold transition active:scale-[0.98] disabled:opacity-40",
        variant === "primary" && "bg-primary text-primary-foreground",
        variant === "outline" && "border border-foreground/80 bg-transparent text-foreground",
        variant === "ghost" && "text-muted-foreground",
        className,
      )}
    />
  );
}
