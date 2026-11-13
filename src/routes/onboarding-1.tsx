import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/onboarding-1")({
  head: () => ({
    meta: [
      { title: "Welcome · Pairly" },
      { name: "description", content: "Pick Menswear or Womenswear and start finding your style." },
      { property: "og:title", content: "Welcome · Pairly" },
      { property: "og:description", content: "Pick Menswear or Womenswear and start finding your style." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
