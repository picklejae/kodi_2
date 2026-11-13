import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/onboarding-4")({
  head: () => ({
    meta: [
      { title: "Fit and budget · Kodi-Me" },
      { name: "description", content: "Add your height, weight and budget for better matches." },
      { property: "og:title", content: "Fit and budget · Kodi-Me" },
      { property: "og:description", content: "Add your height, weight and budget for better matches." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
