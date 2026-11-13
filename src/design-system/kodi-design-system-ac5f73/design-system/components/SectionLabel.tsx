import * as React from "react";
import { cn } from "../utils";

export interface SectionLabelProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h2" | "h3" | "h4" | "p";
}
/** Small uppercase label (YOUR STYLE, SHOP THE PIECES). Not a page heading. */
export const SectionLabel = React.forwardRef<HTMLHeadingElement, SectionLabelProps>(({ className, as: Tag = "h3", ...props }, ref) => (
  <Tag ref={ref} className={cn("text-label font-semibold uppercase tracking-label text-muted-foreground", className)} {...props} />
));
SectionLabel.displayName = "SectionLabel";
