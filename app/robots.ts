import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/",
    },
    sitemap: "https://pokedex-plorer.vercel.app/sitemap.xml",
    host: "https://pokedex-plorer.vercel.app",
  };
}
