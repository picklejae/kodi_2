import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/menu2-saved")({
  head: () => ({
    meta: [
      { title: "Saved · Kodi-Me" },
      { name: "description", content: "Your saved outfits and recent uploads." },
      { property: "og:title", content: "Saved · Kodi-Me" },
      { property: "og:description", content: "Your saved outfits and recent uploads." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
