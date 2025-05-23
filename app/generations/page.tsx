"use client";

import { Card } from "@/components/ui/card";
import { fetchData } from "@/lib/pokemon";
import { motion } from "framer-motion";
import React from "react";

async function fetchGenerations() {
  const data = await fetchData("https://pokeapi.co/api/v2/generation");
  return data.results;
}

export default function GenerationsPage() {
  const [generations, setGenerations] = React.useState([]);

  React.useEffect(() => {
    async function loadGenerations() {
      const data = await fetchGenerations();
      setGenerations(data);
    }
    loadGenerations();
  }, []);

  const genInfo = [
    { region: "Kanto", games: "Red, Blue, Yellow", color: "from-red-500 to-blue-500" },
    { region: "Johto", games: "Gold, Silver, Crystal", color: "from-yellow-500 to-blue-500" },
    { region: "Hoenn", games: "Ruby, Sapphire, Emerald", color: "from-red-500 to-green-500" },
    { region: "Sinnoh", games: "Diamond, Pearl, Platinum", color: "from-blue-500 to-pink-500" },
    { region: "Unova", games: "Black, White, Black 2, White 2", color: "from-gray-700 to-gray-300" },
    { region: "Kalos", games: "X, Y", color: "from-blue-500 to-red-500" },
    { region: "Alola", games: "Sun, Moon, Ultra Sun, Ultra Moon", color: "from-yellow-400 to-blue-400" },
    { region: "Galar", games: "Sword, Shield", color: "from-blue-500 to-red-500" },
    { region: "Paldea", games: "Scarlet, Violet", color: "from-red-500 to-purple-500" },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
          Pokémon Generations
        </h1>
        <p className="text-muted-foreground">
          Explore Pokémon across different game generations and regions
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {generations.map((gen: { name: string }, index: number) => (
          <motion.div
            key={gen.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Card className="overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{gen.name}</h2>
                <p className="text-sm text-muted-foreground">
                  {genInfo[index]?.region || "Unknown Region"} - {genInfo[index]?.games || "Unknown Games"}
                </p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
