import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchBar } from "@/components/search-bar";
import { searchPokemon } from "@/lib/pokemon";
import { Suspense } from "react";
import { SearchSkeleton } from "@/components/search-skeleton"; // Import the skeleton

interface SearchPageProps {
  searchParams?: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams?.q;

  return (
    <main className="container mx-auto px-4 py-8 min-h-screen">
      <div className="max-w-2xl mx-auto mb-12">
        <SearchBar />
      </div>

      {query ? (
        <Suspense fallback={<SearchSkeleton />}>
          <SearchResults query={query} />
        </Suspense>
      ) : (
        <div className="text-center py-16 glass-panel rounded-xl">
          <h1 className="text-4xl font-bold mb-4 text-foreground">
            Search for Pokémon
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Enter a Pokémon name or ID in the search bar above to get started.
          </p>
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center animate-pulse">
            <div className="w-20 h-20 rounded-full bg-background/70"></div>
          </div>
        </div>
      )}
    </main>
  );
}

async function SearchResults({ query }: { query: string }) {
  const results = await searchPokemon(query);

  return (
    <>
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h2 className="text-3xl font-semibold mb-3 text-foreground">
          Results for "{query}"
        </h2>
        <p className="text-md text-muted-foreground">
          {results.length > 0
            ? `Found ${results.length} Pokémon matching your search.`
            : "No Pokémon found matching your search."}
        </p>
      </div>

      {results.length > 0 ? (
        <PokemonGrid initialPokemon={results} />
      ) : (
        <div className="text-center py-16 glass-panel rounded-xl">
          <h2 className="text-2xl font-medium mb-3 text-foreground">
            No Matches Found
          </h2>
          <p className="text-md text-muted-foreground mb-8">
            Try a different Pokémon name or ID.
          </p>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-background/70"></div>
          </div>
        </div>
      )}
    </>
  );
}
