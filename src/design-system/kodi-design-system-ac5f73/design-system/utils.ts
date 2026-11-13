import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: ["display", "title", "heading", "subheading", "body", "body-sm", "price", "caption", "label"] }],
    },
  },
});

/** Merge class names, resolving Tailwind conflicts (aware of KODI type tokens). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
