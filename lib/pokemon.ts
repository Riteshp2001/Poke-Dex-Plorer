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
      return pokemon ? [pokemon] : []; // Ensure pokemon exists
    }

    // Otherwise search by name (exact match)
    // The API handles partial matches by not finding them, leading to 404.
    // We'll catch this and return an empty array, as the suggestions will handle partials.
    const pokemon = await fetchData(
      `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
    );
    return pokemon ? [pokemon] : []; // Ensure pokemon exists
  } catch (error: any) {
    // If a 404 error occurs (or any other error during direct fetch),
    // return an empty array. The search page will then display "No results".
    // The suggestions dropdown will handle partial matches separately.
    if (error.message && error.message.includes("404")) {
      // console.log(`Pokemon "${query}" not found by direct API call.`);
      return [];
    }
    // For other errors, log them but still return empty to prevent page crash
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

// Helper function to get stat color class
export function getStatColorClass(statName: string): string {
  const statColors: Record<string, string> = {
    hp: "bg-red-500",
    attack: "bg-orange-500",
    defense: "bg-yellow-500",
    "special-attack": "bg-blue-500",
    "special-defense": "bg-green-500",
    speed: "bg-pink-500",
  };

  return statColors[statName] || "bg-gray-500";
}

// Export fetchData so it can be used in other files
export { fetchData };
