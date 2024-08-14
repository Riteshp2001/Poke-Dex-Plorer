import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api-fetch";
import { formatPokemonData } from "../utils/pokemon-helper";

const allPokeMonStaticData = new Map();

const usePokemons = (type) => {
  const fetchPokemons = async () => {
    if (!type) return [];

    const getRandomUuid = () => {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    };

    const filterDuplicates = (pokemonsArray) => {
      const seen = new Set();
      return pokemonsArray.filter((pokemon) => {
        const duplicate = seen.has(pokemon.name);
        seen.add(pokemon.name);
        return !duplicate;
      });
    };

    // Return cached data if available
    if (allPokeMonStaticData.has(type)) {
      return allPokeMonStaticData.get(type);
    }

    // Handle 'all' type: return all Pokémon from the cache if already fetched
    if (type === "all" && allPokeMonStaticData.size > 0) {
      const allPokemonDatabase = Array.from(
        allPokeMonStaticData.values()
      ).flat();
      // Remove duplicates by the unique key
      const uniquePokemons = Array.from(
        new Map(
          allPokemonDatabase.map((pokemon) => [pokemon.uniqueKey, pokemon])
        ).values()
      );
      return allPokeMonStaticData.size > 0 ? uniquePokemons : [];
    }

    // Fetch all types if cache is empty
    const typesResponse = await apiFetch("/type");
    const allTypes = typesResponse.results.map((typeObj) => typeObj.name);

    // If all types are cached, return all Pokémon
    const validTypes = allTypes.filter(
      (t) => !["unknown", "shadow", "stellar"].includes(t)
    );
    if (allPokeMonStaticData.size === validTypes.length) {
      return Array.from(allPokeMonStaticData.values()).flat();
    }

    // Fetch Pokémon for each type and cache them
    let allPokemonsArray = [];
    for (const currentType of allTypes) {
      if (["unknown", "shadow", "stellar"].includes(currentType)) continue;

      if (allPokeMonStaticData.has(currentType)) {
        allPokemonsArray = allPokemonsArray.concat(
          allPokeMonStaticData.get(currentType)
        );
        continue;
      }

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
    }

    // Filter out duplicates before caching all Pokémon data
    const filteredAllPokemons = filterDuplicates(allPokemonsArray);
    allPokeMonStaticData.set("all", filteredAllPokemons);

    return filteredAllPokemons;
  };

  const { data } = useQuery(["pokemons", type], fetchPokemons);

  console.log("allPokeMonStaticData", allPokeMonStaticData);

  return data;
};

export default usePokemons;
