import { createFileRoute } from "@tanstack/react-router";
import { SavedLookDetail } from "@/components/pairly/SavedLookDetail";

export const Route = createFileRoute("/menu2-saved-1/$id")({
  head: () => ({
    meta: [
      { title: "Saved outfit · Pairly" },
      { name: "description", content: "Revisit your saved outfit and the pieces paired with your own." },
      { property: "og:title", content: "Saved outfit · Pairly" },
      { property: "og:description", content: "Revisit your saved outfit and the pieces paired with your own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SavedById,
});

function SavedById() {
  const { id } = Route.useParams();
  return <SavedLookDetail id={id} />;
}
