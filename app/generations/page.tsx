"use client";

import { fetchGenerations } from "@/lib/pokemon";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

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
    {
      region: "Kanto",
      games: "Red, Blue, Yellow",
      color: "from-red-500 to-blue-500",
    },
    {
      region: "Johto",
      games: "Gold, Silver, Crystal",
      color: "from-yellow-500 to-blue-500",
    },
    {
      region: "Hoenn",
      games: "Ruby, Sapphire, Emerald",
      color: "from-red-500 to-green-500",
    },
    {
      region: "Sinnoh",
      games: "Diamond, Pearl, Platinum",
      color: "from-blue-500 to-pink-500",
    },
    {
      region: "Unova",
      games: "Black, White, Black 2, White 2",
      color: "from-gray-700 to-gray-300",
    },
    { region: "Kalos", games: "X, Y", color: "from-blue-500 to-red-500" },
    {
      region: "Alola",
      games: "Sun, Moon, Ultra Sun, Ultra Moon",
      color: "from-yellow-400 to-blue-400",
    },
    {
      region: "Galar",
      games: "Sword, Shield",
      color: "from-blue-500 to-red-500",
    },
    {
      region: "Paldea",
      games: "Scarlet, Violet",
      color: "from-red-500 to-purple-500",
    },
  ];

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
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
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link href={`/generations/${index + 1}`} className="block">
              <Card className="overflow-hidden border border-border/50 shadow-md hover:shadow-lg transition-all duration-300 bg-background text-foreground relative rounded-lg">
                <div className="relative p-6 group-hover:scale-105 transition-transform duration-300">
                  <div className="mb-4">
                    <h2 className="text-xl font-semibold mb-2 capitalize">
                      {genInfo[index]?.region || gen.name.replace("-", " ")}
                    </h2>
                    <p className="text-sm text-muted-foreground mb-1 font-medium">
                      {gen.name.replace("-", " ").toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {genInfo[index]?.games || "Unknown Games"}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="inline-block rounded-full bg-muted/10 px-3 py-1 text-xs font-semibold group-hover:bg-muted/20 transition-colors">
                      View Pokémon
                    </span>
                    <div className="w-8 h-8 rounded-full bg-muted/10 flex items-center justify-center group-hover:bg-muted/20 group-hover:scale-110 transition-all">
                      <span className="text-xs font-bold">→</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
