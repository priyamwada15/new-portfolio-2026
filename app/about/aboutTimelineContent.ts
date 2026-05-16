export const ABOUT_HEADLINE = "Designing for Human-AI Interaction since 2021";

export const TIMELINE_DATES = [
  "September 2021",
  "Sep 2021 - July 2024",
  "Aug 2024 - May 2026",
  "May 2025 - Aug 2025",
] as const;

export type TimelineBodyLink = {
  before: string;
  linkText: string;
  href: string;
  after: string;
};

export type TimelineEntry = {
  title: string;
  body: string;
  bodyLink?: TimelineBodyLink;
  company?: "tars" | "rocket";
};

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    title:
      "First official step into Product Design.",
    body: "I was the 21st employee at Tars Technologies and one of the first design hires. There was no design system, no defined process, or how the team would function. The foundation work fell to 3 designers.",
    company: "tars",
  },
  {
    title: "Learning from the engineering team.",
    body: "I learned to read developer docs. Without a design system, the React component library's implementation docs became my guiding light, they told me exactly where I could stretch a component and where I couldn't.",
  },
  {
    title: "I made a list of everything I wanted to learn. Then I did all of it.",
    body: "",
    bodyLink: {
      before:
        "Physical prototyping. Human-Robot Interaction assistant instructor under ",
      linkText: "Dr. Selma Šabanović",
      href: "https://scholar.google.com/citations?user=P5pnLAcAAAAJ&hl=en&oi=ao",
      after: ". A robot dancing to Thriller in Unity.",
    },
  },
  {
    title: "First time working inside a mature design team.",
    body: "I went from being one of three designers at a startup to sitting next to senior product designers at one of the largest fintech companies in the US. I could lean over mid-design and get feedback on an interaction, a decision or just life in general. I learned more in those three months than I expected to.",
    company: "rocket",
  },
];
