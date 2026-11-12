import { DEFAULT_CODE, STYLE_TYPES } from "@/data/styleTypes";
import { usePairly } from "@/store/PairlyContext";
import { Chip } from "./Chip";

export function StyleTypeChip() {
  const t = STYLE_TYPES[usePairly().styleType ?? DEFAULT_CODE];
  return <Chip className="bg-primary text-primary-foreground border-primary">{t.code} · {t.name}</Chip>;
}
