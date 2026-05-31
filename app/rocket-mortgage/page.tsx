import { Metadata } from "next";
import RocketMortgageContent from "./RocketMortgageContent";

export const metadata: Metadata = {
  title: "Rocket Mortgage | Priyamwada Pandey",
  description:
    "I redesigned the interaction model for Rocket's AI assistant and the patterns I proposed made it to the product roadmap.",
};

export default function RocketMortgagePage() {
  return <RocketMortgageContent />;
}
