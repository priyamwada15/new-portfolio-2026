import type { Metadata } from "next";
import ArcadeEffWonGame from "./ArcadeEffWonGame";

export const metadata: Metadata = {
  title: "Arcade EffWon | Priyamwada Pandey",
  description:
    "A pseudo-3D pixel-art F1 racer built in canvas — pick a team, survive 8 laps, don't DNF.",
};

export default function ArcadeEffWonPage() {
  return <ArcadeEffWonGame />;
}
