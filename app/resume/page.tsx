import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume | Priyamwada Pandey",
  description: "Resume for Priyamwada Pandey, a 0→1 product designer for B2B SaaS, AI and marketplace products.",
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
