import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/pairly/PhoneFrame";
import { Diagnosis } from "@/screens/Diagnosis";
import { Results } from "@/screens/Results";
import { Reveal } from "@/screens/Reveal";
import { Upload } from "@/screens/Upload";
import { Welcome } from "@/screens/Welcome";
import { PairlyProvider, usePairly } from "@/store/PairlyContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pairly · Find your Style Type" },
      { name: "description", content: "Pick between outfits for 8 rounds to find your Style Type, then get 3 matches for a piece you own." },
      { property: "og:title", content: "Pairly · Find your Style Type" },
      { property: "og:description", content: "8 quick rounds to your Style Type, then 3 matches for one piece you own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Screens() {
  const { screen } = usePairly();
  if (screen === "diagnosis") return <Diagnosis />;
  if (screen === "reveal") return <Reveal />;
  if (screen === "upload") return <Upload />;
  if (screen === "results") return <Results />;
  return <Welcome />;
}

function Index() {
  return (
    <PairlyProvider>
      <PhoneFrame><Screens /></PhoneFrame>
    </PairlyProvider>
  );
}
