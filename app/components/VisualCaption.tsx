import { visualCaption } from "@/design-system";

export default function VisualCaption({ children }: { children: React.ReactNode }) {
  return <p className={visualCaption}>{children}</p>;
}
