import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { PhoneFrame } from "@/components/pairly/PhoneFrame";
import { Diagnosis } from "@/screens/Diagnosis";
import { Results } from "@/screens/Results";
import { Reveal } from "@/screens/Reveal";
import { Upload } from "@/screens/Upload";
import { Welcome } from "@/screens/Welcome";
import { Social } from "@/screens/Social";
import { Saved } from "@/screens/Saved";
import { Me } from "@/screens/Me";
import { BottomTabBar } from "@/components/pairly/BottomTabBar";
import { CreatePostSheet } from "@/components/pairly/CreatePostSheet";
import { DevJumper } from "@/components/pairly/DevJumper";
import { usePairly } from "@/store/PairlyContext";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pairly · Find your Style Type" },
      { name: "description", content: "Swipe 12 looks to find your style, then get 3 ways to wear one piece you own." },
      { property: "og:title", content: "Pairly · Find your Style Type" },
      { property: "og:description", content: "Swipe 12 looks to find your style, then get 3 ways to wear one piece you own." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Screens() {
  const { screen, activeTab, posts } = usePairly();
  // Also scroll up when a new post is created, so the pinned "Your post" is visible.
  const myPosts = posts.filter((p) => p.isUserPost).length;
  useEffect(() => { window.scrollTo(0, 0); }, [screen, activeTab, myPosts]);
  if (screen === "diagnosis") return <Diagnosis />;
  if (screen === "reveal") return <Reveal />;
  if (screen === "welcome") return <Welcome />;
  return (
    <>
      <div className="flex flex-1 flex-col pb-24">
        {activeTab === "feed" ? <Social /> : activeTab === "saved" ? <Saved /> : activeTab === "me" ? <Me /> : screen === "results" ? <Results /> : <Upload />}
      </div>
      <BottomTabBar />
      <CreatePostSheet />
    </>
  );
}

function Index() {
  return (
    <>
      <PhoneFrame><Screens /></PhoneFrame>
      <DevJumper />
    </>
  );
}
