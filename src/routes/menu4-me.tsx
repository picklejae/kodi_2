import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/menu4-me")({
  head: () => ({
    meta: [
      { title: "Me · Pairly" },
      { name: "description", content: "Your Style Type, fit profile, budget and preferences." },
      { property: "og:title", content: "Me · Pairly" },
      { property: "og:description", content: "Your Style Type, fit profile, budget and preferences." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
