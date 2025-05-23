import { fetchAllPokemonNamesForSuggestions } from "@/lib/pokemon";
import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Base URL
  const baseUrl = "https://pokedex-plorer.vercel.app";

  // Static routes
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/pokedex`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/types`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/generations`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];
  // Get all pokemon names for dynamic routes
  let pokemonRoutes: MetadataRoute.Sitemap = [];
  try {
    const names = await fetchAllPokemonNamesForSuggestions();

    // Create routes for each pokemon (assuming IDs start from 1)
    pokemonRoutes = names.map((name: string, idx: number) => ({
      url: `${baseUrl}/pokedex/${name.toLowerCase()}-${idx + 1}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating Pokemon routes for sitemap:", error);
  }

  return [...staticRoutes, ...pokemonRoutes];
}
