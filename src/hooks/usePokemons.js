import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api-fetch";
import { formatPokemonData } from "../utils/pokemon-helper";

const allPokeMonStaticData = new Map();

const usePokemons = (type) => {
    const fetchPokemons = async () => {
        if (!type) return [];

        // Return cached data if available
        if (allPokeMonStaticData.has(type)) {
            return allPokeMonStaticData.get(type);
        }

        // Handle 'all' type: return all Pokémon from the cache if already fetched
        if (type === 'all' && allPokeMonStaticData.size > 0) {
            const allPokemonDatabase = Array.from(allPokeMonStaticData.values()).flat();
                // Remove duplicates by the unique key
                const uniquePokemons = Array.from(
                    new Map(allPokemonDatabase.map(pokemon => [pokemon.uniqueKey, pokemon])).values()
                );
            return allPokeMonStaticData.size > 0
                ? uniquePokemons
                : [];
        }

        // Fetch all types if cache is empty
        const typesResponse = await apiFetch('/type');
        const allTypes = typesResponse.results.map(typeObj => typeObj.name);

        // If all types are cached, return all Pokémon
        const validTypes = allTypes.filter(t => !['unknown', 'shadow', 'stellar'].includes(t));
        if (allPokeMonStaticData.size === validTypes.length) {
            return Array.from(allPokeMonStaticData.values()).flat();
        }

        // Fetch Pokémon for each type and cache them
        let allPokemonsArray = [];
        for (const currentType of allTypes) {
            if (['unknown', 'shadow', 'stellar'].includes(currentType)) continue;

            if (allPokeMonStaticData.has(currentType)) {
                allPokemonsArray = allPokemonsArray.concat(allPokeMonStaticData.get(currentType));
                continue;
            }

            const { pokemon: pokemonList } = await apiFetch(`/type/${currentType}`);
            const formattedPokemonsOfType = await Promise.all(
                pokemonList.map(async ({ pokemon }) => {
                    const res = await fetch(pokemon.url);
                    const data = await res.json();
                    return {
                        ...formatPokemonData(data),
                        uniqueKey: `${data.id}-${currentType}`,  // Ensure unique keys
                    };
                })
            );

            allPokeMonStaticData.set(currentType, formattedPokemonsOfType);
            allPokemonsArray = allPokemonsArray.concat(formattedPokemonsOfType);
        }

        // Remove duplicates by the unique key
        const uniquePokemons = Array.from(
            new Map(allPokemonsArray.map(pokemon => [pokemon.uniqueKey, pokemon])).values()
        );

        return uniquePokemons;
    };

    const { data } = useQuery(['pokemons', type], fetchPokemons);

    console.log("allPokeMonStaticData", allPokeMonStaticData);

    return data;
};

export default usePokemons;
