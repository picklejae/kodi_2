import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/menu1-style-1")({
  head: () => ({
    meta: [
      { title: "Generated looks · Kodi-Me" },
      { name: "description", content: "Three looks built around the piece you own." },
      { property: "og:title", content: "Generated looks · Kodi-Me" },
      { property: "og:description", content: "Three looks built around the piece you own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
