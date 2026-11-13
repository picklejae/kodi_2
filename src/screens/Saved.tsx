import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Trash2, Minus } from "lucide-react";
import { Drawer as DrawerPrimitive } from "vaul";
import { Photo } from "@/components/pairly/Photo";
import { OutfitBoard } from "@/components/pairly/OutfitBoard";
import { PillButton } from "@/components/pairly/PillButton";
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
    recentItems,
    savedOutfits,
    savedLooks,
    deleteRecent,
    deleteSavedOutfit,
    setUploadedItem,
    go,
  } = usePairly();
  const navigate = useNavigate();
  const [recentEdit, setRecentEdit] = useState(false),
    [savedEdit, setSavedEdit] = useState(false);
  const [selected, setSelected] = useState<RecentItem | null>(null);
  const [pending, setPending] = useState<{ section: "recent" | "saved"; id: string } | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const outfitCount = savedOutfits.length + savedLooks.length;
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
    if (!savedEdit) navigate({ to: "/closet/$id", params: { id } });
  };
  return (
    <div className="px-6 pb-8 pt-12">
      <h1 className="mb-6 font-serif text-4xl">Closet</h1>
      <section aria-label="Recents">
        <SectionHeader
          title="Recents"
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
                <PillButton
                  variant="ghost"
                  aria-label={item.productName}
                  onClick={() => {
                    if (!recentEdit) setSelected(item);
                  }}
                  className={cn("block h-auto w-full rounded-xl p-0", recentEdit && "opacity-60")}
                >
                  <Photo
                    src={item.imageUrl}
                    alt={item.productName}
                    className="aspect-square rounded-xl"
                  />
                </PillButton>
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
      <section className="mt-8" aria-label="Saved outfits">
        <SectionHeader
          title="Saved"
          empty={!outfitCount}
          editing={savedEdit}
          onToggle={() => setSavedEdit(!savedEdit)}
        />
        {!outfitCount ? (
          <p className="py-8 text-center text-sm text-muted-foreground">No saved outfits yet</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              ...savedLooks.map((entry) => ({
                id: entry.id,
                name: entry.ownedName,
                content: (
                  <div className="flex h-full items-center bg-secondary">
                    <OutfitBoard itemImage={entry.ownedImage} items={entry.look.items} />
                  </div>
                ),
              })),
              ...savedOutfits.map((outfit) => ({
                id: outfit.id,
                name: outfit.ownedName,
                content: (
                  <Photo
                    src={outfit.imageUrl}
                    alt={`Outfit with ${outfit.ownedName}`}
                    className="h-full w-full"
                  />
                ),
              })),
            ].map((item) => (
              <div
                key={item.id}
                className={cn(
                  "relative transition duration-200",
                  removing === item.id && "scale-90 opacity-0",
                )}
              >
                <PillButton
                  variant="ghost"
                  onClick={() => openOutfit(item.id)}
                  aria-label={`Open outfit with ${item.name}`}
                  className={cn(
                    "block aspect-[3/4] h-auto overflow-hidden rounded-2xl p-0",
                    savedEdit && "opacity-60",
                  )}
                >
                  {item.content}
                </PillButton>
                {savedEdit && (
                  <DeleteIcon
                    name={item.name}
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
        <DrawerPrimitive.Portal>
          <DrawerPrimitive.Overlay className="recent-sheet-backdrop fixed inset-0 z-40" />
          <DrawerPrimitive.Content
            aria-describedby={undefined}
            className="recent-sheet fixed bottom-0 left-1/2 z-50 h-auto max-h-[50dvh] w-full max-w-[390px] -translate-x-1/2 rounded-t-[20px] bg-background px-4 pt-6 outline-none"
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
        <AlertDialogContent className="max-w-[342px] rounded-2xl">
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
      <h2 className="font-serif text-3xl">{title}</h2>
      {!empty && (
        <PillButton
          variant="ghost"
          onClick={onToggle}
          aria-label={editing ? `Done editing ${title}` : `Delete from ${title}`}
          className={cn("h-9 px-0", editing ? "w-14" : "w-9")}
        >
          {editing ? "Done" : <Trash2 className="h-4 w-4" />}
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
