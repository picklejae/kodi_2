// Client-only copy of src/routes/__root.tsx for the static prototype (no <html> shell, no SSR).
import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { PairlyProvider } from "@/store/PairlyContext";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  component: () => (
    <>
      <PairlyProvider><Outlet /></PairlyProvider>
      <Toaster position="bottom-center" offset={96} mobileOffset={96} />
    </>
  ),
});
