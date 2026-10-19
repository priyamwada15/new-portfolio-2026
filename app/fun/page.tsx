import type { Metadata } from "next";
import { PlaygroundApp } from "./PlaygroundApp";

export const metadata: Metadata = {
  title: "Fun | Priyamwada Pandey",
  description: "Experiments I've built outside of work, from shaders to small games, mostly in code.",
};

export default function PlaygroundPage() {
  return <PlaygroundApp />;
}
