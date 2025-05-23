"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface PokemonCardProps {
  pokemon: {
    id: number
    name: string
    sprites: {
      other: {
        "official-artwork": {
          front_default: string
        }
      }
    }
    types: {
      type: {
        name: string
      }
    }[]
  }
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div variants={item}>
      <Link href={`/pokedex/${pokemon.id}`} className="group block">
        <Card className="overflow-hidden pokemon-card border-0 shadow-lg">
          <div
            className={`p-6 flex items-center justify-center bg-gradient-to-br ${getBackgroundByType(pokemon.types[0]?.type.name)}`}
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 10 }}
            >
              <Image
                src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
                alt={pokemon.name}
                width={180}
                height={180}
                className="drop-shadow-lg"
                style={{ viewTransitionName: `pokemon-image-${pokemon.id}` }}
              />
            </motion.div>
          </div>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <h3
                  className="font-bold capitalize text-lg"
                  style={{ viewTransitionName: `pokemon-name-${pokemon.id}` }}
                >
                  {pokemon.name}
                </h3>
                <p className="text-sm text-muted-foreground font-mono">#{pokemon.id.toString().padStart(3, "0")}</p>
              </div>
              <div className="flex flex-col gap-1">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type type-${type.type.name}`}
                    style={{ viewTransitionName: `pokemon-type-${pokemon.id}-${type.type.name}` }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}

// Helper function to get background gradient based on Pokemon type
function getBackgroundByType(type: string): string {
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
  }

  return typeBackgrounds[type] || "from-gray-200 to-gray-300"
}
