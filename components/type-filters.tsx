"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function TypeFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentType = searchParams.get("type")

  const types = [
    "all",
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]

  const handleTypeClick = (type: string) => {
    if (type === "all") {
      router.push("/pokedex")
    } else {
      router.push(`/pokedex?type=${type}`)
    }
  }

  return (
    <motion.div
      className="w-full overflow-x-auto pb-2 scrollbar-thin"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex space-x-2 min-w-max p-1">
        {types.map((type, index) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Button
              variant={currentType === type || (type === "all" && !currentType) ? "default" : "outline"}
              size="sm"
              onClick={() => handleTypeClick(type)}
              className={`rounded-full px-4 ${type !== "all" ? `type-${type}` : ""}`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
