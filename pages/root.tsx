// Client-only copy of src/routes/__root.tsx for the static prototype (no <html> shell, no SSR).
import type { QueryClient } from "@tanstack/react-query";
import { Navigate, Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { PairlyProvider } from "@/store/PairlyContext";
import { ScreenSync } from "@/components/pairly/AppShell";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  notFoundComponent: () => <Navigate to="/onboarding-1" replace />,
  component: () => (
    <>
      <PairlyProvider><ScreenSync /><Outlet /></PairlyProvider>
      <Toaster position="bottom-center" offset={96} mobileOffset={96} />
    </>
  ),
});
