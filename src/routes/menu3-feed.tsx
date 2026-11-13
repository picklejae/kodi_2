import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/menu3-feed")({
  head: () => ({
    meta: [
      { title: "Feed · Pairly" },
      { name: "description", content: "Vote on looks from people with your style." },
      { property: "og:title", content: "Feed · Pairly" },
      { property: "og:description", content: "Vote on looks from people with your style." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
