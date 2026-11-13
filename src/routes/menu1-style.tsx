import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/pairly/AppShell";

export const Route = createFileRoute("/menu1-style")({
  head: () => ({
    meta: [
      { title: "Style a piece · Kodi-Me" },
      { name: "description", content: "Upload one piece you own and get three ways to wear it." },
      { property: "og:title", content: "Style a piece · Kodi-Me" },
      { property: "og:description", content: "Upload one piece you own and get three ways to wear it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AppShell,
});
