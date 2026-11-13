import { useEffect } from "react";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  // Tap (or click) a toast to close it right away; sonner has no built-in tap-to-dismiss.
  useEffect(() => {
    const onTap = (event: Event) => {
      if ((event.target as Element | null)?.closest?.("[data-sonner-toast]")) toast.dismiss();
    };
    document.addEventListener("click", onTap, true);
    return () => document.removeEventListener("click", onTap, true);
  }, []);
  return (
    <Sonner
      className="toaster group"
      // 2.5s instead of sonner's 4s default: short confirmations shouldn't linger.
      duration={2500}
      toastOptions={{
        classNames: {
          toast:
            "group toast cursor-pointer group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
