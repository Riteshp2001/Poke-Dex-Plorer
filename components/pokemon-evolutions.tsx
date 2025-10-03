"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { fetchEvolutionChain, fetchPokemonById } from "@/lib/pokemon"
import { motion } from "framer-motion"

interface PokemonEvolutionsProps {
  speciesId: string
}

export function PokemonEvolutions({ speciesId }: PokemonEvolutionsProps) {
  const [evolutionChain, setEvolutionChain] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvolutions = async () => {
      try {
        setLoading(true)
        const chain = await fetchEvolutionChain(Number.parseInt(speciesId))

        const processedChain: any[] = []
        const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

        const processChain = async (chain: any) => {
          const speciesUrl = chain.species.url
          const id = speciesUrl.split("/").slice(-2, -1)[0]

          try {
            const pokemon = await fetchPokemonById(Number.parseInt(id))

            processedChain.push({
              id,
              name: pokemon.name,
              type: pokemon.types?.[0]?.type?.name || "unknown",
              sprite: pokemon.sprites.other["official-artwork"].front_default,
            })
          } catch (error) {
            console.error(`Error fetching Pokemon ${id}:`, error)
            processedChain.push({
              id,
              name: chain.species.name,
              type: "unknown",
              sprite: null,
            })
          }

          if (chain.evolves_to.length > 0) {
            for (const evolution of chain.evolves_to) {
              await processChain(evolution)
              await delay(300)
            }
          }
        }

        await processChain(chain.chain)
        setEvolutionChain(processedChain)
      } catch (error) {
        console.error("Error fetching evolution chain:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvolutions()
  }, [speciesId])

  if (loading) {
    return <div className="text-center py-8">Loading evolution chain...</div>
  }

  if (evolutionChain.length <= 1) {
    return <div className="text-center py-4">This Pokémon does not evolve.</div>
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {evolutionChain.map((pokemon, index) => {
        const slug = `/pokedex/${pokemon.name}-${pokemon.type}-${pokemon.id}`

        return (
          <div key={pokemon.id} className="flex items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="flex flex-col items-center">
              <Link href={slug}>
                <Image
                  src={pokemon.sprite || "/placeholder.svg"}
                  alt={pokemon.name}
                  width={120}
                  height={120}
                  className="transition-all duration-300"
                />
                <p className="text-center capitalize mt-2">{pokemon.name}</p>
              </Link>
            </motion.div>

            {index < evolutionChain.length - 1 && (
              <ChevronRight className="mx-2 h-6 w-6 text-muted-foreground" />
            )}
          </div>
        )
      })}
    </div>
  )
}