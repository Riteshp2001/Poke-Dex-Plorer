import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { fetchPokemonById, fetchPokemonSpecies } from "@/lib/pokemon";
import { PokemonEvolutions } from "@/components/pokemon-evolutions";

export async function generateMetadata({ params }: { params: { id: string } }) {
  try {
    const pokemon = await fetchPokemonById(Number.parseInt(params.id));
    return {
      title: `${
        pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
      } | Pokémon Explorer`,
      description: `Learn all about ${pokemon.name} - stats, abilities, moves, and more.`,
    };
  } catch (error) {
    return {
      title: "Pokémon Not Found | Pokémon Explorer",
      description: "The requested Pokémon could not be found.",
    };
  }
}

export default async function PokemonPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const id = Number.parseInt(params.id);
    const pokemon = await fetchPokemonById(id);
    const species = await fetchPokemonSpecies(id);

    const englishFlavorText =
      species.flavor_text_entries
        .find(
          (entry: { language: { name: string } }) =>
            entry.language.name === "en"
        )
        ?.flavor_text.replace(/\f/g, " ")
        .replace(/\u00ad\n/g, "")
        .replace(/\u00ad/g, "")
        .replace(/\n/g, " ") || "No description available.";

    const prevId = id > 1 ? id - 1 : null;
    const nextId = id < 1010 ? id + 1 : null;

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <Button variant="ghost" asChild>
            <Link href="/">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Pokédex
            </Link>
          </Button>

          <div className="flex gap-2">
            {prevId && (
              <Button variant="outline" size="icon" asChild>
                <Link href={`/pokemon/${prevId}`}>
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Previous Pokémon</span>
                </Link>
              </Button>
            )}

            {nextId && (
              <Button variant="outline" size="icon" asChild>
                <Link href={`/pokemon/${nextId}`}>
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">Next Pokémon</span>
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
            <Image
              src={
                pokemon.sprites.other["official-artwork"].front_default ||
                "/placeholder.svg"
              }
              alt={pokemon.name}
              width={400}
              height={400}
              priority
              className="transition-all duration-300 hover:scale-105"
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
                <p className="text-2xl font-bold text-muted-foreground">
                  #{pokemon.id.toString().padStart(3, "0")}
                </p>
              </div>

              <div className="flex gap-2 mt-2">
                {pokemon.types.map((type: any) => (
                  <span
                    key={type.type.name}
                    className={`pokemon-type type-${type.type.name} px-3 py-1 text-sm`}
                    style={{
                      viewTransitionName: `pokemon-type-${pokemon.id}-${type.type.name}`,
                    }}
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose dark:prose-invert">
              <p>{englishFlavorText}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Height
                </h3>
                <p className="text-lg font-medium">{pokemon.height / 10} m</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Weight
                </h3>
                <p className="text-lg font-medium">{pokemon.weight / 10} kg</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Abilities
                </h3>
                <div className="flex flex-wrap gap-1">
                  {pokemon.abilities.map((ability: any) => (
                    <span key={ability.ability.name} className="capitalize">
                      {ability.ability.name.replace("-", " ")}
                      {ability.is_hidden && " (Hidden)"}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">
                  Base Experience
                </h3>
                <p className="text-lg font-medium">
                  {pokemon.base_experience || "Unknown"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="stats" className="mt-12">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-3 md:grid-cols-4">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="moves">Moves</TabsTrigger>
            <TabsTrigger value="evolution">Evolution</TabsTrigger>
            <TabsTrigger value="sprites">Sprites</TabsTrigger>
          </TabsList>

          <TabsContent value="stats" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {pokemon.stats.map((stat: any) => (
                    <div key={stat.stat.name} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium capitalize">
                          {stat.stat.name.replace("-", " ")}
                        </span>
                        <span className="text-sm font-medium">
                          {stat.base_stat}
                        </span>
                      </div>
                      <Progress
                        value={stat.base_stat}
                        max={255}
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="moves" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {pokemon.moves.slice(0, 20).map((move: any) => (
                    <div key={move.move.name} className="p-2 bg-muted rounded">
                      <p className="capitalize text-sm">
                        {move.move.name.replace("-", " ")}
                      </p>
                    </div>
                  ))}
                </div>
                {pokemon.moves.length > 20 && (
                  <p className="text-sm text-muted-foreground mt-4">
                    Showing 20 of {pokemon.moves.length} moves
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <PokemonEvolutions
                  speciesId={pokemon.species.url.split("/").slice(-2, -1)[0]}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sprites" className="mt-6">
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {pokemon.sprites.front_default && (
                    <div className="flex flex-col items-center">
                      <Image
                        src={
                          pokemon.sprites.front_default || "/placeholder.svg"
                        }
                        alt={`${pokemon.name} front default`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        Front Default
                      </span>
                    </div>
                  )}
                  {pokemon.sprites.back_default && (
                    <div className="flex flex-col items-center">
                      <Image
                        src={pokemon.sprites.back_default || "/placeholder.svg"}
                        alt={`${pokemon.name} back default`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        Back Default
                      </span>
                    </div>
                  )}
                  {pokemon.sprites.front_shiny && (
                    <div className="flex flex-col items-center">
                      <Image
                        src={pokemon.sprites.front_shiny || "/placeholder.svg"}
                        alt={`${pokemon.name} front shiny`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        Front Shiny
                      </span>
                    </div>
                  )}
                  {pokemon.sprites.back_shiny && (
                    <div className="flex flex-col items-center">
                      <Image
                        src={pokemon.sprites.back_shiny || "/placeholder.svg"}
                        alt={`${pokemon.name} back shiny`}
                        width={96}
                        height={96}
                        className="pixelated"
                      />
                      <span className="text-xs text-muted-foreground mt-1">
                        Back Shiny
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  } catch (error) {
    console.error("Error fetching pokemon:", error);
    notFound();
  }
}
