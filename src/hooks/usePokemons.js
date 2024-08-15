import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api-fetch";
import { formatPokemonData } from "../utils/pokemon-helper";

const allPokeMonStaticData = new Map();

const usePokemons = (type) => {
  const filterDuplicates = (pokemonsArray) => {
    const seen = new Set();
    return pokemonsArray.filter((pokemon) => {
      const duplicate = seen.has(pokemon.name);
      seen.add(pokemon.name);
      return !duplicate;
    });
  };

  const getRandomUuid = () => {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        var r = (Math.random() * 16) | 0,
          v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  };

  const fetchAllPokemons = async () => {
    if (allPokeMonStaticData.size === 0) {
      // Fetch all types
      const typesResponse = await apiFetch("/type");
      const allTypes = typesResponse.results.map((typeObj) =>
        typeObj.name.trim().toLowerCase()
      );

      const validTypes = allTypes.filter(
        (t) => !["unknown", "shadow", "stellar"].includes(t)
      );

      let allPokemonsArray = [];

      // Fetch Pokémon for each type sequentially
      for (const currentType of validTypes) {
        try {
          const { pokemon: pokemonList } = await apiFetch(
            `/type/${currentType}`
          );
          const formattedPokemonsOfType = await Promise.all(
            pokemonList.map(async ({ pokemon }) => {
              const res = await fetch(pokemon.url);
              const data = await res.json();
              const uniqueKey = `${
                data.name
              }-${currentType}-${getRandomUuid()}`;
              return {
                ...formatPokemonData(data),
                uniqueKey: uniqueKey,
              };
            })
          );

          // Filter out duplicates before storing in the cache
          const filteredPokemons = filterDuplicates(formattedPokemonsOfType);
          allPokeMonStaticData.set(currentType, filteredPokemons);
          allPokemonsArray = allPokemonsArray.concat(filteredPokemons);
        } catch (error) {
          console.error(
            `Error fetching Pokémon of type ${currentType}:`,
            error
          );
        }
      }

      // Filter out duplicates before caching all Pokémon data
      const filteredAllPokemons = filterDuplicates(allPokemonsArray);
      allPokeMonStaticData.set("all", filteredAllPokemons);
    }

    return allPokeMonStaticData;
  };

  const { data, isLoading, isSuccess } = useQuery(
    ["allPokemons"],
    fetchAllPokemons,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );

  if (isSuccess) {
    if (type === "all") {
      return data.get("all") || [];
    }
    return data.get(type) || [];
  }

  // Return empty array or loading state while fetching
  return isLoading ? [] : [];
};

export default usePokemons;
