"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PokemonCard } from "@/components/pokemon-card"
import { Button } from "@/components/ui/button"
import { fetchPokemon, fetchPokemonByType } from "@/lib/pokemon"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

interface Pokemon {
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

interface PokemonGridProps {
  initialPokemon: Pokemon[]
}

export function PokemonGrid({ initialPokemon }: PokemonGridProps) {
  const [pokemon, setPokemon] = useState<Pokemon[]>(initialPokemon)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const typeFilter = searchParams.get("type")

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        let data
        if (typeFilter) {
          data = await fetchPokemonByType(typeFilter)
        } else {
          data = await fetchPokemon(1, 12)
        }
        setPokemon(data)
        setPage(1)
      } catch (error) {
        console.error("Error fetching pokemon:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [typeFilter])

  // Update the loadMore function to handle loading state better
  const loadMore = async () => {
    if (loading) return // Prevent multiple simultaneous loads

    setLoading(true)
    try {
      const nextPage = page + 1
      const newPokemon = await fetchPokemon(nextPage, 12)
      setPokemon([...pokemon, ...newPokemon])
      setPage(nextPage)
    } catch (error) {
      console.error("Error loading more pokemon:", error)
    } finally {
      setLoading(false)
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  return (
    <div className="space-y-8">
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {pokemon.map((p) => (
          <PokemonCard key={p.id} pokemon={p} />
        ))}
      </motion.div>

      {!typeFilter && (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button onClick={loadMore} disabled={loading} className="min-w-[150px] rounded-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </motion.div>
      )}
    </div>
  )
}
