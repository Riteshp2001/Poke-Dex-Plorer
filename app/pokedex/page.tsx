import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchBar } from "@/components/search-bar";
import { TypeFilters } from "@/components/type-filters";
import { fetchPokemon } from "@/lib/pokemon";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "National PokeDex | PokeDex Explorer",
  description:
    "Browse through all Pokémon species, filter by type, or search for your favorites in our comprehensive PokeDex.",
  openGraph: {
    title: "National PokeDex | PokeDex Explorer",
    description:
      "Browse through all Pokémon species, filter by type, or search for your favorites in our comprehensive PokeDex.",
    type: "website",
    images: [
      {
        url: "/og?name=PokeDex Explorer&image=/all-pokemon.svg&type=all",
        width: 1200,
        height: 630,
        alt: "National PokeDex Explorer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "National PokeDex | PokeDex Explorer",
    description:
      "Browse through all Pokémon species, filter by type, or search for your favorites in our comprehensive PokeDex.",
    images: ["/og?name=PokeDex Explorer&image=/all-pokemon.svg&type=all"],
  },
};

export default async function PokedexPage() {
  const pokemonData = await fetchPokemon(1, 12);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
          National PokeDex
        </h1>
        <p className="text-muted-foreground">
          Browse through all Pokémon species, filter by type, or search for your
          favorites
        </p>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="mb-8">
        <TypeFilters />
      </div>

      <PokemonGrid initialPokemon={pokemonData} />
    </main>
  );
}
