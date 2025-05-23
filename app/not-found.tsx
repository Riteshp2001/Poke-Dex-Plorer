"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function NotFound() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[70vh] px-4 py-8 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-800"></div>
        </div>
        <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-medium mb-6">Pokémon Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The Pokémon you're looking for might be hiding in tall grass. Try searching for a different one!
        </p>
        <Button size="lg" className="rounded-full" asChild>
          <Link href="/pokedex">Return to PokeDex</Link>
        </Button>
      </motion.div>
    </div>
  )
}
