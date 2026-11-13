import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/onboarding-3")({
  head: () => ({
    meta: [
      { title: "Style Passport · Kodi-Me" },
      { name: "description", content: "See your Style Type and the four style axes behind it." },
      { property: "og:title", content: "Style Passport · Kodi-Me" },
      { property: "og:description", content: "See your Style Type and the four style axes behind it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
