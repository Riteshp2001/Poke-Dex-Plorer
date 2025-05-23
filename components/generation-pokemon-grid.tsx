"use client";

import { useState } from "react";
import { PokemonCard } from "@/components/pokemon-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { fetchPokemonByGeneration } from "@/lib/pokemon";

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    other: {
      "official-artwork": {
        front_default: string;
      };
    };
  };
  types: {
    type: {
      name: string;
    };
  }[];
}

interface GenerationPokemonGridProps {
  initialPokemon: Pokemon[];
  generationId: number;
  totalCount: number;
}

export function GenerationPokemonGrid({
  initialPokemon,
  generationId,
  totalCount,
}: GenerationPokemonGridProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialPokemon);
  const [loading, setLoading] = useState(false);
  const [currentCount, setCurrentCount] = useState(initialPokemon.length);

  const loadMorePokemon = async () => {
    setLoading(true);
    try {
      const { pokemonData } = await fetchPokemonByGeneration(
        generationId,
        currentCount + 16
      );
      setPokemon(pokemonData);
      setCurrentCount(pokemonData.length);
    } catch (error) {
      console.error("Error loading more Pokemon:", error);
    } finally {
      setLoading(false);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      {/* Header with count */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h2 className="text-3xl font-bold mb-4 md:mb-0">Featured Pokémon</h2>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Showing {currentCount} of {totalCount}
        </Badge>
      </div>

      {/* Pokemon Grid */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {pokemon.map((pokemon) => (
          <motion.div key={pokemon.id} variants={item}>
            <PokemonCard pokemon={pokemon} />
          </motion.div>
        ))}
      </motion.div>

      {/* Load More Button */}
      {currentCount < totalCount && (
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Showing {currentCount} of {totalCount} Pokémon from this generation
          </p>
          <Button
            onClick={loadMorePokemon}
            disabled={loading}
            className="rounded-full px-8 py-2 hover:scale-105 transition-transform"
            variant="outline"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More Pokémon"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
