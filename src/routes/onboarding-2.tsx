import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/onboarding-2")({
  head: () => ({
    meta: [
      { title: "Style quiz · Pairly" },
      { name: "description", content: "Swipe 12 looks to find your Style Type." },
      { property: "og:title", content: "Style quiz · Pairly" },
      { property: "og:description", content: "Swipe 12 looks to find your Style Type." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
