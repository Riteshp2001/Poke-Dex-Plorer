"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { PokemonEvolutions } from "./pokemon-evolutions";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { getBackgroundByType, getStatColorClass } from "@/lib/pokemon";

export default function PokemonTabs({ pokemon }: { pokemon: any }) {
  const [activeTab, setActiveTab] = useState<
    "stats" | "moves" | "evolution" | "sprites"
  >("stats");

  // Get background gradient based on Pokemon's primary type
  const primaryType = pokemon.types[0]?.type.name || "normal";
  const bgGradient = getBackgroundByType(primaryType);

  const tabBaseClasses =
    "rounded-lg px-4 py-2 transition-all duration-200 ease-in-out transform";
  const activeTabClasses =
    "bg-primary text-primary-foreground scale-105 shadow-md";
  const inactiveTabHoverClasses = "hover:bg-muted/50 hover:scale-105";

  return (
    <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
      <TabsList className="mt-12 grid w-full grid-cols-1 gap-2 rounded-xl sm:grid-cols-2 md:grid-cols-4 md:w-auto md:inline-grid">
        <TabsTrigger
          value="stats"
          className={`${tabBaseClasses} ${
            activeTab === "stats" ? activeTabClasses : inactiveTabHoverClasses
          }`}
        >
          Stats
        </TabsTrigger>
        <TabsTrigger
          value="moves"
          className={`${tabBaseClasses} ${
            activeTab === "moves" ? activeTabClasses : inactiveTabHoverClasses
          }`}
        >
          Moves
        </TabsTrigger>
        <TabsTrigger
          value="evolution"
          className={`${tabBaseClasses} ${
            activeTab === "evolution"
              ? activeTabClasses
              : inactiveTabHoverClasses
          }`}
        >
          Evolution
        </TabsTrigger>
        <TabsTrigger
          value="sprites"
          className={`${tabBaseClasses} ${
            activeTab === "sprites" ? activeTabClasses : inactiveTabHoverClasses
          }`}
        >
          Sprites
        </TabsTrigger>
      </TabsList>

      <TabsContent value="stats" className="mt-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6 space-y-6">
            {pokemon.stats.map((stat: any) => {
              const pct = Math.min(100, (stat.base_stat / 255) * 100);
              return (
                <div key={stat.stat.name} className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium capitalize">
                      {stat.stat.name.replace("-", " ")}
                    </span>
                    <span className="text-sm font-medium">
                      {stat.base_stat}
                    </span>
                  </div>
                  <div className="stat-bar bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`stat-value ${getStatColorClass(
                        stat.stat.name
                      )}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="moves" className="mt-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 text-center">
              {pokemon.moves.map((move: any) => (
                <div key={move.move.name} className="p-2 bg-muted rounded-lg">
                  <p className="capitalize text-sm">
                    {move.move.name.replace("-", " ")}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="evolution" className="mt-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <PokemonEvolutions
              speciesId={pokemon.species.url.split("/").slice(-2, -1)[0]}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="sprites" className="mt-6">
        <Card className="border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                "front_default",
                "back_default",
                "front_shiny",
                "back_shiny",
              ].map((key) => {
                const url = (pokemon.sprites as any)[key];
                if (!url) return null;
                const label = key
                  .replace("_", " ")
                  .replace("front", "Front")
                  .replace("back", "Back")
                  .replace("default", "Default")
                  .replace("shiny", "Shiny");
                return (
                  <div
                    key={key}
                    className="flex flex-col items-center bg-muted p-4 rounded-xl"
                  >
                    <Image
                      src={url}
                      alt={`${pokemon.name} ${label}`}
                      width={96}
                      height={96}
                      className="pixelated"
                    />
                    <span className="text-sm text-muted-foreground mt-2">
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
