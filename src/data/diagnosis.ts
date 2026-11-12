import { LOOK_IMAGES as L, type Axis } from "./styleTypes";

export interface DiagnosisOption { image: string; letter: string; label: string }
export interface DiagnosisRound { id: number; axis: Axis; a: DiagnosisOption; b: DiagnosisOption }

// 8 rounds, 2 per axis.
export const ROUNDS: DiagnosisRound[] = [
  { id: 1, axis: "fit", a: { image: L.suit, letter: "T", label: "Sharp and fitted" }, b: { image: L.casual, letter: "R", label: "Loose and easy" } },
  { id: 2, axis: "color", a: { image: L.coat, letter: "N", label: "Calm tones" }, b: { image: L.fashion, letter: "C", label: "Some color" } },
  { id: 3, axis: "detail", a: { image: L.tee, letter: "P", label: "Plain and clean" }, b: { image: L.denim, letter: "D", label: "Texture and wear" } },
  { id: 4, axis: "mood", a: { image: L.suit2, letter: "F", label: "Dressed up" }, b: { image: L.street, letter: "S", label: "Street ready" } },
  { id: 5, axis: "fit", a: { image: L.suit3, letter: "T", label: "Structured" }, b: { image: L.street2, letter: "R", label: "Relaxed" } },
  { id: 6, axis: "color", a: { image: L.suit, letter: "N", label: "Navy and grey" }, b: { image: L.street, letter: "C", label: "Bright accents" } },
  { id: 7, axis: "detail", a: { image: L.suit2, letter: "P", label: "Solid" }, b: { image: L.suit3, letter: "D", label: "Pattern" } },
  { id: 8, axis: "mood", a: { image: L.coat, letter: "F", label: "Polished" }, b: { image: L.denim, letter: "S", label: "Casual" } },
];
