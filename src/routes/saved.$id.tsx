import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/saved/$id")({
  beforeLoad: ({ params }) => { throw redirect({ to: "/menu2-saved-1/$id", params: { id: params.id }, replace: true }); },
});
