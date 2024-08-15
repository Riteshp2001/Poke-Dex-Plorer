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

  const fetchPokemons = async () => {
    // Check if the cache is already populated
    if (allPokeMonStaticData.size === 0) {
      // Fetch all types
      const typesResponse = await apiFetch("/type");
      const allTypes = typesResponse.results.map((typeObj) => typeObj.name);

      const validTypes = allTypes.filter(
        (t) => !["unknown", "shadow", "stellar"].includes(t)
      );

      let allPokemonsArray = [];
      for (const currentType of validTypes) {
        const { pokemon: pokemonList } = await apiFetch(`/type/${currentType}`);
        const formattedPokemonsOfType = await Promise.all(
          pokemonList.map(async ({ pokemon }) => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            const uniqueKey = `${data.name}-${currentType}-${getRandomUuid()}`;
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
        console.log("Fetching :",currentType);
      }

      // Filter out duplicates before caching all Pokémon data
      const filteredAllPokemons = filterDuplicates(allPokemonsArray);
      allPokeMonStaticData.set("all", filteredAllPokemons);
    }

    // Handle 'all' type: return all Pokémon from the cache
    if (type === "all") {
      return allPokeMonStaticData.get("all") || [];
    }

    // Return Pokémon of the specific type from the cache
    return allPokeMonStaticData.get(type) || [];
  };

  const { data } = useQuery(["pokemons", type], fetchPokemons);

  return data;
};

export default usePokemons;
