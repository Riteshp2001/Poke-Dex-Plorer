import { notFound } from "next/navigation"
import { PokemonGrid } from "@/components/pokemon-grid"
import { SearchBar } from "@/components/search-bar"
import { searchPokemon } from "@/lib/pokemon"

interface SearchPageProps {
  searchParams: { q: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q

  if (!query) {
    notFound()
  }

  const results = await searchPokemon(query)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Search Results for "{query}"</h1>
        <p className="text-muted-foreground">
          {results.length > 0
            ? `Found ${results.length} Pokémon matching your search`
            : "No Pokémon found matching your search"}
        </p>
      </div>

      <div className="mb-8">
        <SearchBar />
      </div>

      {results.length > 0 ? (
        <PokemonGrid initialPokemon={results} />
      ) : (
        <div className="text-center py-12 glass-panel">
          <h2 className="text-2xl font-medium mb-2">No Pokémon found</h2>
          <p className="text-muted-foreground mb-6">Try searching for a different Pokémon name or ID</p>
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-background"></div>
          </div>
        </div>
      )}
    </main>
  )
}
