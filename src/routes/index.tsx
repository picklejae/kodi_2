import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  beforeLoad: () => { throw redirect({ to: "/onboarding-1", search: (prev: Record<string, unknown>) => prev }); },
  head: () => ({
    meta: [
      { title: "Kodi-Me · Find your Style Type" },
      { name: "description", content: "Swipe 12 looks to find your style, then get 3 ways to wear one piece you own." },
      { property: "og:title", content: "Kodi-Me · Find your Style Type" },
      { property: "og:description", content: "Swipe 12 looks to find your style, then get 3 ways to wear one piece you own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});
