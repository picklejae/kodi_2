import * as React from "react";
import { cn } from "../utils";

export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  /** Hide the label visually (still read by screen readers). */
  hideLabel?: boolean;
  error?: string;
}
/** Square 48px input with visible 2px Ink focus. */
export const TextField = React.forwardRef<HTMLInputElement, TextFieldProps>(({ className, label, hideLabel, error, id, ...props }, ref) => {
  const auto = React.useId();
  const fid = id ?? auto;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fid} className={cn("text-body-sm font-medium text-foreground", hideLabel && "sr-only")}>{label}</label>
      <input ref={ref} id={fid} aria-invalid={!!error || undefined} aria-describedby={error ? `${fid}-err` : undefined}
        className={cn("h-12 w-full border border-input bg-background px-4 text-body text-foreground outline-none transition-colors duration-200 ease-kodi placeholder:text-disabled focus:border-2 focus:border-border-strong focus:px-[15px] disabled:text-disabled", className)} {...props} />
      {error && <p id={`${fid}-err`} className="text-caption text-destructive">{error}</p>}
    </div>
  );
});
TextField.displayName = "TextField";
