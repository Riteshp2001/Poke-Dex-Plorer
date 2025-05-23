"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { fetchTypes } from "@/lib/pokemon";
import { motion } from "framer-motion";
import React from "react";

export default function TypesPage() {
  const [types, setTypes] = React.useState<Array<{ name: string }>>([]);

  React.useEffect(() => {
    async function loadTypes() {
      const data = await fetchTypes();
      setTypes(data);
    }
    loadTypes();
  }, []);
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
          Pokémon Types
        </h1>
        <p className="text-muted-foreground">
          Explore Pokémon by their elemental types and discover their unique
          characteristics
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {types.map((type: { name: string }, index: number) => (
          <motion.div
            key={type.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index }}
          >
            <Link href={`/pokedex?type=${type.name}`}>
              <Card
                className={`hover:shadow-lg transition-all type-${type.name} border-0 pokemon-card`}
              >
                <CardContent className="p-6 flex items-center justify-center">
                  <span className="text-lg font-medium capitalize text-white">
                    {type.name}
                  </span>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
