import { Metadata } from "next";
import RocketMortgageContent from "./RocketMortgageContent";

export const metadata: Metadata = {
  title: "Rocket Mortgage | AI Assistant Interaction Design Case Study | Priyamwada Pandey",
  description:
    "I redesigned Rocket Mortgage's AI assistant for homebuyers, adding personalized task cards, contextual guidance and human handoff, with interaction patterns that shaped the product roadmap.",
  keywords: [
    "AI assistant design",
    "conversational UX design",
    "fintech UX case study",
    "chatbot interaction design",
    "product design internship",
  ],
};

export default function RocketMortgagePage() {
  return <RocketMortgageContent />;
}
