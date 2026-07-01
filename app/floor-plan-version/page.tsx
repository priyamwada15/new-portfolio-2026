import type { Metadata } from "next";
import { FloorPlanScaler } from "./FloorPlanScaler";

export const metadata: Metadata = {
  title: "Floor Plan | Priyamwada Pandey",
  description: "An alternate homepage laid out as a floor plan — each room is a chapter of Priyamwada's work.",
};

export default function FloorPlanVersionPage() {
  return (
    <div className="w-full overflow-hidden bg-[#bfb74c]">
      <FloorPlanScaler />
    </div>
  );
}
