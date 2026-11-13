import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Pencil, Minus } from "lucide-react";
import { Drawer as DrawerPrimitive } from "vaul";
import { Photo } from "@/components/pairly/Photo";
import { PillButton } from "@/components/pairly/PillButton";
import { PHONE_FRAME_ID } from "@/components/pairly/PhoneFrame";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { usePairly } from "@/store/PairlyContext";
import type { RecentItem } from "@/data/saved";
import { GENERIC_ATTRIBUTES } from "@/data/samples";
import { cn } from "@/lib/utils";
export function Saved() {
  const {
    recentItems: allRecent,
    savedOutfits: allSaved,
    stylePreference,
    deleteRecent,
    deleteSavedOutfit,
    setUploadedItem,
    go,
  } = usePairly();
  const navigate = useNavigate();
  // Demo examples follow Men/Women; the user's own uploads and saves (no department) always show.
  const pref = stylePreference ?? "menswear";
  const recentItems = allRecent.filter((item) => !item.department || item.department === pref);
  const savedOutfits = allSaved.filter((outfit) => !outfit.department || outfit.department === pref);
  const [recentEdit, setRecentEdit] = useState(false),
    [savedEdit, setSavedEdit] = useState(false);
  const [selected, setSelected] = useState<RecentItem | null>(null);
  const [pending, setPending] = useState<{ section: "recent" | "saved"; id: string } | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const outfitCount = savedOutfits.length;
  useEffect(() => {
    if (!recentItems.length) setRecentEdit(false);
    if (!outfitCount) setSavedEdit(false);
  }, [recentItems.length, outfitCount]);
  const confirm = () => {
    if (!pending) return;
    const target = pending;
    setPending(null);
    setRemoving(target.id);
    setTimeout(() => {
      if (target.section === "recent") deleteRecent(target.id);
      else deleteSavedOutfit(target.id);
      setRemoving(null);
    }, 180);
  };
  const openOutfit = (id: string) => {
    if (!savedEdit) navigate({ to: "/menu2-saved-1/$id", params: { id } });
  };
  return (
    <div className="px-6 pb-8 pt-12">
      <h1 className="mb-6 text-title font-bold">Saved</h1>
      <section aria-label="Recent Uploads">
        <SectionHeader
          title="Recent Uploads"
          empty={!recentItems.length}
          editing={recentEdit}
          onToggle={() => setRecentEdit(!recentEdit)}
        />
        {!recentItems.length ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Upload a photo to get started
          </p>
        ) : (
          <div className="recent-carousel mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto pb-2">
            {recentItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative min-w-0 shrink-0 basis-[calc((100%-24px)/3.5)] snap-start transition duration-200",
                  removing === item.id && "scale-90 opacity-0",
                )}
              >
                <button
                  type="button"
                  aria-label={item.productName}
                  onClick={() => {
                    if (!recentEdit) setSelected(item);
                  }}
                  className={cn("block w-full rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-ring", recentEdit && "opacity-60")}
                >
                  <Photo
                    src={item.imageUrl}
                    alt={item.productName}
                    className="aspect-square w-full rounded-xl"
                  />
                </button>
                {recentEdit && (
                  <DeleteIcon
                    name={item.productName}
                    onClick={() => setPending({ section: "recent", id: item.id })}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <section className="mt-8" aria-label="Saved Outfits">
        <SectionHeader
          title="Saved Outfits"
          empty={!outfitCount}
          editing={savedEdit}
          onToggle={() => setSavedEdit(!savedEdit)}
        />
        {!outfitCount ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No saved outfits yet</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {savedOutfits.map((outfit) => ({
                id: outfit.id,
                name: outfit.ownedName,
                outfit,
                content: (
                  <Photo
                    src={outfit.imageUrl}
                    alt={`Outfit with ${outfit.ownedName}`}
                    className="h-full w-full [&_img]:object-top"
                  />
                ),
              })).map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative transition duration-200",
                  removing === item.id && "scale-90 opacity-0",
                )}
              >
                <button
                  type="button"
                  onClick={() => openOutfit(item.id)}
                  aria-label={`Open outfit with ${item.name}`}
                  className={cn(
                    "block aspect-[3/4] w-full overflow-hidden rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    savedEdit && "opacity-60",
                  )}
                >
                  {item.content}
                </button>
                {savedEdit && (
                  <DeleteIcon
                    name={`outfit with ${item.name}`}
                    onClick={() => setPending({ section: "saved", id: item.id })}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </section>
      <DrawerPrimitive.Root
        open={!!selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        shouldScaleBackground={false}
      >
        <DrawerPrimitive.Portal container={typeof document === "undefined" ? undefined : document.getElementById(PHONE_FRAME_ID)}>
          <DrawerPrimitive.Overlay className="recent-sheet-backdrop fixed inset-0 z-40" />
          <DrawerPrimitive.Content
            aria-describedby={undefined}
            className="recent-sheet fixed bottom-0 left-1/2 z-50 h-auto max-h-[359px] w-full max-w-sheet -translate-x-1/2 rounded-t-[20px] bg-background px-4 pt-6 outline-none"
          >
            <div className="absolute left-1/2 top-2 h-[5px] w-9 -translate-x-1/2 rounded-full bg-muted-foreground/40" />
            {selected && (
              <>
                <div className="flex items-center gap-4">
                  <Photo
                    src={selected.imageUrl}
                    alt={selected.productName}
                    className="h-24 w-24 shrink-0 rounded-[12px]"
                  />
                  <div className="min-w-0 flex-1">
                    <DrawerPrimitive.Title className="text-[17px] font-semibold leading-snug [overflow-wrap:anywhere]">
                      {selected.productName}
                    </DrawerPrimitive.Title>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                      {uploadCaption(selected.uploadedAt)}
                    </p>
                  </div>
                </div>
                <PillButton
                  className="mt-5 h-[50px] rounded-[14px]"
                  onClick={() => {
                    setUploadedItem({
                      image: selected.imageUrl,
                      name: selected.productName,
                      category: selected.category,
                      attributes: selected.attributes ?? GENERIC_ATTRIBUTES[selected.category],
                      source: "sample",
                    });
                    setSelected(null);
                    go("upload");
                  }}
                >
                  Find matching outfits
                </PillButton>
              </>
            )}
          </DrawerPrimitive.Content>
        </DrawerPrimitive.Portal>
      </DrawerPrimitive.Root>
      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <AlertDialogContent className="max-w-sheet rounded-2xl">
          <AlertDialogTitle className="font-serif text-2xl">Delete this item?</AlertDialogTitle>
          <AlertDialogDescription className="sr-only">
            Remove this item from this collection.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={confirm}
            >
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
function SectionHeader({
  title,
  empty,
  editing,
  onToggle,
}: {
  title: string;
  empty: boolean;
  editing: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="font-serif text-[28px] leading-9">{title}</h2>
      {!empty && (
        <PillButton
          variant="ghost"
          onClick={onToggle}
          aria-label={editing ? `Done editing ${title}` : `Edit ${title}`}
          className={cn("h-9 px-0", editing ? "w-14" : "w-9")}
        >
          {editing ? "Done" : <Pencil className="h-4 w-4" />}
        </PillButton>
      )}
    </div>
  );
}
function DeleteIcon({ name, onClick }: { name: string; onClick: () => void }) {
  return (
    <PillButton
      aria-label={`Delete ${name}`}
      onClick={onClick}
      className="absolute right-1 top-1 h-6 w-6 bg-destructive px-0 text-destructive-foreground shadow-soft"
    >
      <Minus className="h-4 w-4" />
    </PillButton>
  );
}
function uploadCaption(uploadedAt: string) {
  const days = Math.max(0, Math.floor((Date.now() - new Date(uploadedAt).getTime()) / 86400000));
  return days === 0
    ? "Uploaded today"
    : days === 1
      ? "Uploaded 1 day ago"
      : `Uploaded ${days} days ago`;
}
