import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "../utils/api-fetch";
import { formatPokemonData } from "../utils/pokemon-helper";

const pokemonCache = {
    all: null,
    individual: {}
};

const fetchAllPokemons = async () => {
    const typesResponse = await apiFetch('/type');
    const allTypes = typesResponse.results.map(type => type.name);

    let allPokemonsArray = [];
    for (let i = 0; i < allTypes.length; i++) {
        const { pokemon: pokemonList } = await apiFetch(`/type/${allTypes[i]}`);
        const pokemonsOfType = await Promise.all(
            pokemonList.map(async ({ pokemon }) => {
                const res = await fetch(pokemon.url);
                const data = await res.json();
                return formatPokemonData(data);
            })
        );
        allPokemonsArray = allPokemonsArray.concat(pokemonsOfType);
    }

    // Remove duplicates by Pokémon ID
    const uniquePokemons = Array.from(
        new Map(allPokemonsArray.map(pokemon => [pokemon.id, pokemon])).values()
    );

    return uniquePokemons;
};

const fetchPokemonsByType = async (type) => {
    const { pokemon: pokemonList } = await apiFetch(`/type/${type}`);
    const pokemons = await Promise.all(
        pokemonList.map(async ({ pokemon }) => {
            const res = await fetch(pokemon.url);
            const data = await res.json();
            return formatPokemonData(data);
        })
    );

    return pokemons;
};

const usePokemons = (type) => {
    const fetchPokemons = async () => {
        if (type === 'all') {
            if (!pokemonCache.all) {
                pokemonCache.all = await fetchAllPokemons();
            }
            return pokemonCache.all;
        } else {
            if (!pokemonCache.individual[type]) {
                pokemonCache.individual[type] = await fetchPokemonsByType(type);
            }
            return pokemonCache.individual[type];
        }
    };

    const { data } = useQuery(['pokemons', type], fetchPokemons, {
        staleTime: 1000 * 60 * 60, // Cache data for 1 hour
        cacheTime: 1000 * 60 * 60 * 24, // Keep cache for 24 hours
    });

    return data;
};

export default usePokemons;
