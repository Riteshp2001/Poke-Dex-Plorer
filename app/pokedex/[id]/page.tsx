import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { fetchPokemonById, fetchPokemonSpecies } from "@/lib/pokemon"
import { PokemonEvolutions } from "@/components/pokemon-evolutions"
import { Badge } from "@/components/ui/badge"

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const pokemon = await fetchPokemonById(Number.parseInt(params.id))
    return {
      title: `${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} | PokeDex Explorer`,
      description: `Learn all about ${pokemon.name} - stats, abilities, moves, and more.`,
    }
  } catch (error) {
    return {
      title: "Pokémon Not Found | PokeDex Explorer",
      description: "The requested Pokémon could not be found.",
    }
  }
}

export default async function PokemonPage({ params }: { params: { id: string } }) {
  try {
    const id = Number.parseInt(params.id)
    const pokemon = await fetchPokemonById(id)
    const species = await fetchPokemonSpecies(id)

    const englishFlavorText =
      species.flavor_text_entries
        .find((entry: any) => entry.language.name === "en")
        ?.flavor_text.replace(/\f/g, " ")
        .replace(/\u00ad\n/g, "")
        .replace(/\u00ad/g, "")
        .replace(/\n/g, " ") || "No description available."

    const prevId = id > 1 ? id - 1 : null
    const nextId = id < 1010 ? id + 1 : null

    // Get background gradient based on Pokemon's primary type
    const primaryType = pokemon.types[0]?.type.name || "normal"
    const bgGradient = getBackgroundByType(primaryType)

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" className="rounded-full" asChild>
            <Link href="/pokedex">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to PokeDex
            </Link>
          </Button>

          <div className="flex gap-2">
            {prevId && (
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link href={`/pokedex/${prevId}`}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Pokémon</span>
                </Link>
              </Button>
            )}

            {nextId && (
              <Button variant="outline" size="icon" className="rounded-full" asChild>
                <Link href={`/pokedex/${nextId}`}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Pokémon</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className={`rounded-3xl p-8 flex items-center justify-center bg-gradient-to-br ${bgGradient} shadow-lg`}>
            <Image
              src={pokemon.sprites.other["official-artwork"].front_default || "/placeholder.svg"}
              alt={pokemon.name}
              width={400}
              height={400}
              priority
              className="transition-all duration-300 hover:scale-105 drop-shadow-xl"
              style={{ viewTransitionName: `pokemon-image-${pokemon.id}` }}
            />
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1
                  className="text-4xl font-bold capitalize"
                  style={{ viewTransitionName: `pokemon-name-${pokemon.id}` }}
                >
                  {pokemon.name}
                </h1>
                <p className="text-2xl font-bold text-muted-foreground font-mono">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </div>

              <div className="flex gap-2 mt-3">
                {pokemon.types.map((type) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type type-${type.type.name} px-4 py-1.5 text-sm`}
                    style={{ viewTransitionName: `pokemon-type-${pokemon.id}-${type.type.name}` }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose dark:prose-invert">
              <p className="text-lg">{englishFlavorText}</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Height</h3>
                  <p className="text-2xl font-medium">{pokemon.height / 10} m</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Weight</h3>
                  <p className="text-2xl font-medium">{pokemon.weight / 10} kg</p>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Abilities</h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {pokemon.abilities.map((ability: any) => (
                      <Badge
                        key={ability.ability.name}
                        variant={ability.is_hidden ? "outline" : "default"}
                        className="capitalize"
                      >
                        {ability.ability.name.replace("-", " ")}
                        {ability.is_hidden && " (Hidden)"}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">Base Experience</h3>
                  <p className="text-2xl font-medium">{pokemon.base_experience || "Unknown"}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stats" className="mt-12">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4 rounded-xl">
            <TabsTrigger value="stats" className="rounded-lg">
              Stats
            </TabsTrigger>
            <TabsTrigger value="moves" className="rounded-lg">
              Moves
            </TabsTrigger>
            <TabsTrigger value="evolution" className="rounded-lg">
              Evolution
            </TabsTrigger>
            <TabsTrigger value="sprites" className="rounded-lg">
              Sprites
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {pokemon.stats.map((stat: any) => (
                    <div key={stat.stat.name} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">{stat.stat.name.replace("-", " ")}</span>
                        <span className="text-sm font-medium">{stat.base_stat}</span>
                      </div>
                      <div className="stat-bar">
                        <div
                          className={`stat-value ${getStatColorClass(stat.stat.name)}`}
                          style={{ width: `${Math.min(100, (stat.base_stat / 255) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moves" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {pokemon.moves.slice(0, 20).map((move: any) => (
                    <div key={move.move.name} className="p-2 bg-muted rounded-lg">
                      <p className="capitalize text-sm">{move.move.name.replace("-", " ")}</p>
                    </div>
                  ))}
                </div>
                {pokemon.moves.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4">Showing 20 of {pokemon.moves.length} moves</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <PokemonEvolutions speciesId={pokemon.species.url.split("/").slice(-2, -1)[0]} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sprites" className="mt-6">
            <Card className="border-0 shadow-lg">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pokemon.sprites.front_default && (
                    <div className="flex flex-col items-center bg-muted p-4 rounded-xl">
                      <Image
                        src={pokemon.sprites.front_default || "/placeholder.svg"}
                        alt={`${pokemon.name} front default`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-2">Front Default</span>
                    </div>
                  )}
                  {pokemon.sprites.back_default && (
                    <div className="flex flex-col items-center bg-muted p-4 rounded-xl">
                      <Image
                        src={pokemon.sprites.back_default || "/placeholder.svg"}
                        alt={`${pokemon.name} back default`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-2">Back Default</span>
                    </div>
                  )}
                  {pokemon.sprites.front_shiny && (
                    <div className="flex flex-col items-center bg-muted p-4 rounded-xl">
                      <Image
                        src={pokemon.sprites.front_shiny || "/placeholder.svg"}
                        alt={`${pokemon.name} front shiny`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-2">Front Shiny</span>
                    </div>
                  )}
                  {pokemon.sprites.back_shiny && (
                    <div className="flex flex-col items-center bg-muted p-4 rounded-xl">
                      <Image
                        src={pokemon.sprites.back_shiny || "/placeholder.svg"}
                        alt={`${pokemon.name} back shiny`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-2">Back Shiny</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error fetching pokemon:", error)
    notFound()
  }
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

// Helper function to get stat color class
function getStatColorClass(statName: string): string {
  const statColors: Record<string, string> = {
    hp: "bg-red-500",
    attack: "bg-orange-500",
    defense: "bg-yellow-500",
    "special-attack": "bg-blue-500",
    "special-defense": "bg-green-500",
    speed: "bg-pink-500",
  }

  return statColors[statName] || "bg-gray-500"
}
