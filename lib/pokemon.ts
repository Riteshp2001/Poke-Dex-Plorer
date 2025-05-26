// Helper function to fetch data
async function fetchData(url: string) {
	// Add delay to prevent rate limiting
	const delay = (ms: number) =>
		new Promise((resolve) => setTimeout(resolve, ms));

	let retries = 3;
	while (retries > 0) {
		try {
			const response = await fetch(url);

			// Handle rate limiting
			if (response.status === 429) {
				console.log("Rate limited, waiting before retry...");
				await delay(1000); // Wait 1 second before retrying
				retries--;
				continue;
			}

			if (!response.ok) {
				throw new Error(
					`Failed to fetch data from ${url}: ${response.status} ${response.statusText}`
				);
			}

			return response.json();
		} catch (error) {
			console.error(`Error fetching ${url}:`, error);
			retries--;
			if (retries === 0) throw error;
			await delay(500); // Wait before retry
		}
	}

	throw new Error(`Failed to fetch data from ${url} after multiple attempts`);
}

// Fetch a list of Pokemon with pagination
export async function fetchPokemon(page = 1, limit = 12) {
	// Reduced limit from 24 to 12
	const offset = (page - 1) * limit;
	const data = await fetchData(
		`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
	);

	// Process in batches to avoid too many concurrent requests
	const pokemonData = [];
	const batchSize = 3; // Process 3 at a time

	for (let i = 0; i < data.results.length; i += batchSize) {
		const batch = data.results.slice(i, i + batchSize);
		const batchData = await Promise.all(
			batch.map(async (pokemon: { url: string }) => {
				return fetchData(pokemon.url);
			})
		);
		pokemonData.push(...batchData);

		// Add a small delay between batches
		if (i + batchSize < data.results.length) {
			await new Promise((resolve) => setTimeout(resolve, 300));
		}
	}

	return pokemonData;
}

// Fetch a single Pokemon by ID
export async function fetchPokemonById(id: number) {
	return fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
}

// Fetch Pokemon by type
export async function fetchPokemonByType(type: string) {
	const data = await fetchData(`https://pokeapi.co/api/v2/type/${type}`);

	// Limit to 12 Pokemon and process in batches
	const pokemonEntries = data.pokemon.slice(0, 12);
	const pokemonData = [];
	const batchSize = 3;

	for (let i = 0; i < pokemonEntries.length; i += batchSize) {
		const batch = pokemonEntries.slice(i, i + batchSize);
		const batchData = await Promise.all(
			batch.map(async (entry: { pokemon: { url: string } }) => {
				return fetchData(entry.pokemon.url);
			})
		);
		pokemonData.push(...batchData);

		// Add a small delay between batches
		if (i + batchSize < pokemonEntries.length) {
			await new Promise((resolve) => setTimeout(resolve, 300));
		}
	}

	return pokemonData;
}

// Fetch Pokemon species data
export async function fetchPokemonSpecies(id: number) {
	return fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
}

// Fetch evolution chain
export async function fetchEvolutionChain(speciesId: number) {
	const species = await fetchPokemonSpecies(speciesId);
	const evolutionChainUrl = species.evolution_chain.url;
	return fetchData(evolutionChainUrl);
}

// Update the searchPokemon function to handle rate limiting better
export async function searchPokemon(query: string) {
	try {
		// Try to fetch by ID if query is a number
		if (!isNaN(Number(query))) {
			const pokemon = await fetchPokemonById(Number(query));
			return pokemon ? [pokemon] : [];
		}

		// Try exact name match first
		const allNames = await fetchAllPokemonNames();
		const exactMatch = allNames.find(
			(name: string) => name.toLowerCase() === query.trim().toLowerCase()
		);
		if (exactMatch) {
			// Fetch and return the exact match
			const pokemon = await fetchData(
				`https://pokeapi.co/api/v2/pokemon/${exactMatch}`
			);
			return pokemon ? [pokemon] : [];
		}

		// Otherwise, do a partial match (case-insensitive)
		const filteredNames = allNames.filter((name: string) =>
			name.toLowerCase().includes(query.trim().toLowerCase())
		);
		if (filteredNames.length === 0) return [];

		// Fetch all matching Pokémon (limit to 20 for performance)
		const batchSize = 3;
		const results = [];
		for (let i = 0; i < filteredNames.length && i < 20; i += batchSize) {
			const batch = filteredNames.slice(i, i + batchSize);
			const batchData = await Promise.all(
				batch.map(async (name: string) => {
					try {
						return await fetchData(`https://pokeapi.co/api/v2/pokemon/${name}`);
					} catch {
						return null;
					}
				})
			);
			results.push(...batchData.filter(Boolean));
			if (i + batchSize < filteredNames.length && i + batchSize < 20) {
				await new Promise((resolve) => setTimeout(resolve, 300));
			}
		}
		return results;
	} catch (error: any) {
		if (error.message && error.message.includes("404")) {
			return [];
		}
		console.error(`Error in searchPokemon for query "${query}":`, error);
		return [];
	}
}

// Fetch all Types
export async function fetchTypes() {
	const data = await fetchData("https://pokeapi.co/api/v2/type");
	return data.results.filter(
		(type: { name: string }) => !["unknown", "shadow"].includes(type.name)
	);
}

// Fetch all generations
export async function fetchGenerations() {
	const data = await fetchData("https://pokeapi.co/api/v2/generation");
	return data.results;
}

// Fetch generation details by ID
export async function fetchGenerationById(id: number) {
	return fetchData(`https://pokeapi.co/api/v2/generation/${id}`);
}

// Fetch Pokemon for a specific generation
export async function fetchPokemonByGeneration(
	generationId: number,
	limit = 16
) {
	try {
		const genData = await fetchGenerationById(generationId);
		const species = genData.pokemon_species.sort((a: any, b: any) =>
			a.url.localeCompare(b.url)
		);

		// Fetch detailed pokemon data (limited)
		const pokemonPromises = species.slice(0, limit).map(async (s: any) => {
			const id = s.url.split("/").filter(Boolean).pop();
			try {
				return await fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`);
			} catch {
				return null;
			}
		});

		const pokemonData = (await Promise.all(pokemonPromises)).filter(Boolean);
		return { pokemonData, totalCount: species.length };
	} catch (error) {
		console.error("Error fetching pokemon by generation:", error);
		throw error;
	}
}

// Fetch all Pokemon names
export async function fetchAllPokemonNames() {
	try {
		const data = await fetchData(
			"https://pokeapi.co/api/v2/pokemon?limit=1500" // Fetching a large limit to get most names
		);
		return data.results.map((pokemon: { name: string }) => pokemon.name);
	} catch (error) {
		console.error("Error fetching all Pokemon names:", error);
		return []; // Return empty array on error
	}
}

// Fetch all Pokemon names for suggestions
export async function fetchAllPokemonNamesForSuggestions() {
	try {
		// Using a slightly larger limit to ensure most names are available for type-ahead
		const response = await fetch(
			"https://pokeapi.co/api/v2/pokemon?limit=1500"
		);
		if (!response.ok) {
			// Log the error but don't let it crash the suggestion fetching
			console.error(
				`Failed to fetch Pokémon names: ${response.status} ${response.statusText}`
			);
			return [];
		}
		const data = await response.json();
		// Ensure data.results is an array before mapping
		return Array.isArray(data.results)
			? data.results.map((pokemon: { name: string }) => pokemon.name)
			: [];
	} catch (error) {
		console.error("Error fetching all Pokemon names for suggestions:", error);
		return []; // Return empty array on error to prevent crashing suggestions
	}
}

// Helper function to get background gradient based on Pokemon type
export function getBackgroundByType(type: string): string {
	const typeBackgrounds: Record<string, string> = {
		normal: "from-gray-200 to-gray-300",
		fire: "from-red-400 to-orange-300",
		water: "from-blue-400 to-sky-300",
		electric: "from-yellow-300 to-amber-200",
		grass: "from-green-400 to-emerald-300",
		ice: "from-blue-200 to-cyan-100",
		fighting: "from-red-600 to-red-500",
		poison: "from-purple-500 to-fuchsia-400",
		ground: "from-yellow-600 to-amber-500",
		flying: "from-indigo-300 to-sky-200",
		psychic: "from-pink-400 to-rose-300",
		bug: "from-lime-400 to-green-300",
		rock: "from-stone-500 to-stone-400",
		ghost: "from-purple-700 to-indigo-600",
		dragon: "from-indigo-600 to-blue-500",
		dark: "from-gray-700 to-gray-600",
		steel: "from-gray-400 to-slate-300",
		fairy: "from-pink-300 to-pink-200",
	};

	return typeBackgrounds[type] || "from-gray-200 to-gray-300";
}

export function getTypeColorClass(type: string): string {
	const typeColors: Record<string, string> = {
		normal: "#d6d6d6",
		fire: "#f87171",
		water: "#60a5fa",
		electric: "#facc15",
		grass: "#4ade80",
		ice: "#bfdbfe",
		fighting: "#dc2626",
		poison: "#a855f7",
		ground: "#ca8a04",
		flying: "#818cf8",
		psychic: "#f472b6",
		bug: "#a3e635",
		rock: "#78716c",
		ghost: "#6d28d9",
		dragon: "#4f46e5",
		dark: "#374151",
		steel: "#9ca3af",
		fairy: "#f9a8d4",
	};

	return typeColors[type] || "#d6d6d6"; // Default to a neutral gray color
}

// Helper function to get stat color class
export function getStatColorClass(statName: string): string {
	const statColors: Record<string, string> = {
		hp: "bg-red-500",
		attack: "bg-orange-500",
		defense: "bg-yellow-500",
		"special-attack": "bg-blue-500",
		"special-defense": "bg-green-500",
		speed: "bg-pink-500",
		accuracy: "bg-purple-500",
		evasion: "bg-indigo-500",
	};

	// Lowercase match to ensure safety
	return statColors[statName.toLowerCase()] || "bg-gray-500";
}


export const BASE_URL =
	process.env.NODE_ENV === "development"
		? "http://localhost:3000"
		: "https://poke-dex-plorer.vercel.app";

// Export fetchData so it can be used in other files
export { fetchData };
