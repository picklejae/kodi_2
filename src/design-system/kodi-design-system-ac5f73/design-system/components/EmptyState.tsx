import * as React from "react";
import { cn } from "../utils";

export interface EmptyStateProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  description: string;
  /** Optional single PrimaryButton. */
  action?: React.ReactNode;
}
/** Says exactly what to do next. No illustrations. */
export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(({ className, title, description, action, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col items-center gap-2 px-8 py-12 text-center", className)} {...props}>
    <h2 className="text-subheading font-semibold text-foreground">{title}</h2>
    <p className="text-body-sm text-muted-foreground">{description}</p>
    {action && <div className="mt-4">{action}</div>}
  </div>
));
EmptyState.displayName = "EmptyState";
