import * as React from "react";
import logo from "../../assets/logos/kodi-logo.png";
import { cn } from "../utils";

export interface LogoProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** `bar` = 20px tall for bars, `hero` = 104px wide for Welcome. */
  size?: "bar" | "hero";
  /** `auto` inverts in dark mode; `black`/`white` force a tone. */
  tone?: "auto" | "black" | "white";
}
/** The KODI wordmark image. Never retype it in a font. */
export const Logo = React.forwardRef<HTMLImageElement, LogoProps>(({ className, size = "bar", tone = "auto", alt = "KODI", ...props }, ref) => (
  <img
    ref={ref}
    src={logo}
    alt={alt}
    className={cn(size === "bar" ? "h-5 w-auto" : "w-[104px] h-auto", tone === "white" && "invert", tone === "auto" && "dark:invert", "select-none", className)}
    {...props}
  />
));
Logo.displayName = "Logo";
