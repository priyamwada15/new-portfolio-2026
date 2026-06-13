import type { MetadataRoute } from "next";

const BASE_URL = "https://www.priyamwada.me";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/home-v2", "/tars-asimov", "/debug-animation", "/flip-board-test"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
