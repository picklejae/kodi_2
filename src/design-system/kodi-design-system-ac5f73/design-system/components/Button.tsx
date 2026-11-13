import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../utils";
import { Spinner } from "./Spinner";

export const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 rounded-pill font-sans whitespace-nowrap transition-colors duration-200 ease-kodi outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "h-[52px] px-6 text-body font-semibold bg-primary text-primary-foreground active:bg-muted-foreground",
        secondary: "h-12 px-5 text-body-sm font-medium border border-border-strong bg-background text-foreground active:bg-secondary aria-pressed:bg-secondary disabled:border-disabled disabled:text-disabled",
      },
      fullWidth: { true: "w-full", false: "" },
    },
    defaultVariants: { variant: "primary", fullWidth: false },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Shows one spinner and hides the label. */
  loading?: boolean;
}

/** Pill button. `primary` = the one black action per screen; `secondary` = outlined. Label: verb + object. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, fullWidth, loading = false, disabled, children, ...props }, ref) => {
    const isDisabled = disabled && !loading;
    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, fullWidth }),
          isDisabled && (variant ?? "primary") === "primary" && "bg-disabled text-primary-foreground/70",
          className,
        )}
        disabled={disabled || loading}
        aria-busy={loading || undefined}
        {...props}
      >
        <span className={cn("inline-flex items-center gap-2", loading && "invisible")}>{children}</span>
        {loading && <Spinner className="absolute size-5" />}
      </button>
    );
  },
);
Button.displayName = "Button";

export type PrimaryButtonProps = Omit<ButtonProps, "variant">;
/** The single black action on a screen. */
export const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>((props, ref) => <Button ref={ref} variant="primary" {...props} />);
PrimaryButton.displayName = "PrimaryButton";

export type SecondaryButtonProps = Omit<ButtonProps, "variant">;
/** Outlined pill for important-but-secondary actions. */
export const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>((props, ref) => <Button ref={ref} variant="secondary" {...props} />);
SecondaryButton.displayName = "SecondaryButton";
