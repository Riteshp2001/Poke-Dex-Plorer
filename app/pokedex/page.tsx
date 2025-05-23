
import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchBar } from "@/components/search-bar";
import { TypeFilters } from "@/components/type-filters";
import { fetchPokemon } from "@/lib/pokemon";

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
