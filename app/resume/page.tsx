import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Priyamwada Pandey",
  description: "Resume for Priyamwada Pandey. Product Designer focused on AI-native interfaces.",
};

export default function ResumePage() {
  return (
    <iframe
      src="/resume.pdf"
      title="Priyamwada Pandey resume"
      className="h-screen w-screen"
    />
  );
}
