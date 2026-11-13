import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter, createHashHistory } from "@tanstack/react-router";
import { routeTree } from "@/routeTree.gen";
import "@/styles.css";

const queryClient = new QueryClient();
// Hash history: GitHub Pages has no rewrites, so /saved/x must live after the #.
const router = createRouter({ routeTree, history: createHashHistory(), context: { queryClient } });

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
