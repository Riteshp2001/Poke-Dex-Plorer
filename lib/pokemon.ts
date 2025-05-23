// Helper function to fetch data
async function fetchData(url: string) {
  // Add delay to prevent rate limiting
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

  let retries = 3
  while (retries > 0) {
    try {
      const response = await fetch(url)

      // Handle rate limiting
      if (response.status === 429) {
        console.log("Rate limited, waiting before retry...")
        await delay(1000) // Wait 1 second before retrying
        retries--
        continue
      }

      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.status} ${response.statusText}`)
      }

      return response.json()
    } catch (error) {
      console.error(`Error fetching ${url}:`, error)
      retries--
      if (retries === 0) throw error
      await delay(500) // Wait before retry
    }
  }

  throw new Error(`Failed to fetch data from ${url} after multiple attempts`)
}

// Fetch a list of Pokemon with pagination
export async function fetchPokemon(page = 1, limit = 12) {
  // Reduced limit from 24 to 12
  const offset = (page - 1) * limit
  const data = await fetchData(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`)

  // Process in batches to avoid too many concurrent requests
  const pokemonData = []
  const batchSize = 3 // Process 3 at a time

  for (let i = 0; i < data.results.length; i += batchSize) {
    const batch = data.results.slice(i, i + batchSize)
    const batchData = await Promise.all(
      batch.map(async (pokemon: { url: string }) => {
        return fetchData(pokemon.url)
      }),
    )
    pokemonData.push(...batchData)

    // Add a small delay between batches
    if (i + batchSize < data.results.length) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  return pokemonData
}

// Fetch a single Pokemon by ID
export async function fetchPokemonById(id: number) {
  return fetchData(`https://pokeapi.co/api/v2/pokemon/${id}`)
}

// Fetch Pokemon by type
export async function fetchPokemonByType(type: string) {
  const data = await fetchData(`https://pokeapi.co/api/v2/type/${type}`)

  // Limit to 12 Pokemon and process in batches
  const pokemonEntries = data.pokemon.slice(0, 12)
  const pokemonData = []
  const batchSize = 3

  for (let i = 0; i < pokemonEntries.length; i += batchSize) {
    const batch = pokemonEntries.slice(i, i + batchSize)
    const batchData = await Promise.all(
      batch.map(async (entry: { pokemon: { url: string } }) => {
        return fetchData(entry.pokemon.url)
      }),
    )
    pokemonData.push(...batchData)

    // Add a small delay between batches
    if (i + batchSize < pokemonEntries.length) {
      await new Promise((resolve) => setTimeout(resolve, 300))
    }
  }

  return pokemonData
}

// Fetch Pokemon species data
export async function fetchPokemonSpecies(id: number) {
  return fetchData(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
}

// Fetch evolution chain
export async function fetchEvolutionChain(speciesId: number) {
  const species = await fetchPokemonSpecies(speciesId)
  const evolutionChainUrl = species.evolution_chain.url
  return fetchData(evolutionChainUrl)
}

// Update the searchPokemon function to handle rate limiting better
export async function searchPokemon(query: string) {
  try {
    // Try to fetch by ID if query is a number
    if (!isNaN(Number(query))) {
      const pokemon = await fetchPokemonById(Number(query))
      return [pokemon]
    }

    // Otherwise search by name
    const pokemon = await fetchData(`https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`)
    return [pokemon]
  } catch (error) {
    // If direct search fails, fetch all and filter
    try {
      const allPokemon = await fetchData("https://pokeapi.co/api/v2/pokemon?limit=100") // Reduced from 1000 to 100

      const filteredResults = allPokemon.results.filter((pokemon: { name: string }) =>
        pokemon.name.includes(query.toLowerCase()),
      )

      if (filteredResults.length === 0) {
        return []
      }

      // Fetch detailed data for filtered results (limit to 12)
      const pokemonData = []
      const batchSize = 3
      for (let i = 0; i < filteredResults.length; i += batchSize) {
        const batch = filteredResults.slice(i, i + batchSize)
        const batchData = await Promise.all(
          batch.map(async (pokemon: { url: string }) => {
            return fetchData(pokemon.url)
          }),
        )
        pokemonData.push(...batchData)

        // Add a small delay between batches
        if (i + batchSize < filteredResults.length) {
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      }

      return pokemonData
    } catch (searchError) {
      console.error("Error in search fallback:", searchError)
      return [] // Return empty array if all search methods fail
    }
  }
}

// Export fetchData so it can be used in other files
export { fetchData }
