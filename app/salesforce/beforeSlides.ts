import type { BeforeAfterSlide } from "./BeforeAfterCarousel";

/** "Before" platforms students had to piece together — used in the Course Details carousel. */
export const BEFORE_SLIDES: BeforeAfterSlide[] = [
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title: "Platform 1: iGPS portal of IUB for enrollment into classes",
    images: [
      {
        src: "/new-salesforce/iGPS%20view.avif",
        alt: "iGPS class search portal in the Indiana University enrollment system",
        width: 656,
        height: 372,
      },
    ],
    caption: "Limited and scattered information",
  },
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title: "Platform 2: Degree requirements live in another page",
    images: [
      {
        src: "/new-salesforce/Degree%20Requirements.avif",
        alt: "Indiana University degree requirements page showing major and degree tabs",
        width: 654,
        height: 372,
      },
    ],
    caption: "Students had to have multiple tabs open to process information.",
  },
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title:
      "Platform 3: Course reviews live on community platforms and in person 1-1 communication",
    images: [
      {
        src: "/new-salesforce/Reddit%201.avif",
        alt: "Reddit thread discussing course difficulty",
        width: 550,
        height: 184,
        top: 92,
      },
      {
        src: "/new-salesforce/Reddit%202.avif",
        alt: "Reddit thread with replies debating a course recommendation",
        width: 654,
        height: 258,
        top: 206,
      },
    ],
    caption:
      "Students rely on Reddit or upperclassmen for course reviews when deciding between courses.",
  },
  {
    badgeLabel: "before",
    badgeBg: "#FFEBEB",
    badgeColor: "#CB2A2F",
    badgeBorder: "#E59597",
    title: "Platform 4: Sites like RateMyProfessor give students insights into the professor's teaching style",
    images: [
      {
        src: "/new-salesforce/RateMyProfessor.avif",
        alt: "RateMyProfessor page showing a professor's overall rating and rating distribution",
        width: 654,
        height: 372,
        redactions: [
          { left: "1.07%", top: "24.73%", width: "36.39%", height: "23.66%" },
          { left: "0.15%", bottom: "0.27%", width: "37.31%", height: "9.68%", borderRadius: "0 0 0 7px" },
        ],
      },
    ],
    caption:
      "RateMyProfessor provides reviews but these are calculated based on generic criteria rather than qualitative information.",
  },
];
