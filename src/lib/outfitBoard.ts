// Browser-only composition invoked on a feedback tap, never at import or during SSR.
export async function makeOutfitBoard(images: [string, string, string]): Promise<string> {
  const loaded = await Promise.all(images.map((src) => new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load outfit photo"));
    image.src = src;
  })));
  const canvas = document.createElement("canvas");
  canvas.width = 720; canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not create outfit board");
  const draw = (image: HTMLImageElement, x: number, y: number, width: number, height: number) => {
    const scale = Math.max(width / image.naturalWidth, height / image.naturalHeight);
    const sw = width / scale, sh = height / scale;
    ctx.drawImage(image, (image.naturalWidth - sw) / 2, (image.naturalHeight - sh) / 2, sw, sh, x, y, width, height);
  };
  const [owned, first, second] = loaded;
  if (!owned || !first || !second) throw new Error("Missing outfit photo");
  draw(owned, 0, 0, 352, 640); draw(first, 368, 0, 352, 312); draw(second, 368, 328, 352, 312);
  return canvas.toDataURL("image/jpeg", 0.85);
}