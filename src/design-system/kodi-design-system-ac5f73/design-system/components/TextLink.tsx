import * as React from "react";
import { cn } from "../utils";

const linkClass = "inline-flex min-h-touch items-center text-body-sm font-medium text-muted-foreground underline decoration-1 underline-offset-[3px] transition-colors duration-200 ease-kodi hover:text-foreground active:text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:text-disabled";

export interface TextLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}
/** Underlined text link for navigation (Retake quiz, View). */
export const TextLink = React.forwardRef<HTMLAnchorElement, TextLinkProps>(({ className, ...props }, ref) => (
  <a ref={ref} className={cn(linkClass, className)} {...props} />
));
TextLink.displayName = "TextLink";

export interface TextLinkButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
/** Same look as TextLink, for in-page actions (Skip quiz, Regenerate, + Add a vibe). */
export const TextLinkButton = React.forwardRef<HTMLButtonElement, TextLinkButtonProps>(({ className, type = "button", ...props }, ref) => (
  <button ref={ref} type={type} className={cn(linkClass, "cursor-pointer", className)} {...props} />
));
TextLinkButton.displayName = "TextLinkButton";
