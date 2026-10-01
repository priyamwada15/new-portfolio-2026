import { Metadata } from "next";
import RocketMortgageContent from "./RocketMortgageContent";

export const metadata: Metadata = {
  title: "Rocket Mortgage | AI Assistant Interaction Design Case Study | Priyamwada Pandey",
  description:
    "I redesigned Rocket Assist, Rocket Mortgage's AI assistant for homebuyers, with answers personalized by loan stage, sourced cards and in-chat handoff. In usability testing, 92% of clients found it more helpful and 75% more trustworthy.",
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
