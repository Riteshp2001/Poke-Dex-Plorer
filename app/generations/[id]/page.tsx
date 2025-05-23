import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchGenerationById, fetchPokemonByGeneration } from "@/lib/pokemon";
import { GenerationPokemonGrid } from "@/components/generation-pokemon-grid";

export default async function GenerationDetailPage({
  params,
}: {
  params: { id: string };
}) {
  try {
    // Fetch generation details and Pokemon
    const [genData, pokemonResult] = await Promise.all([
      fetchGenerationById(Number(params.id)),
      fetchPokemonByGeneration(Number(params.id), 16),
    ]);

    const { pokemonData, totalCount } = pokemonResult;

    // Get generation info
    const generationName =
      genData.names.find((n: any) => n.language.name === "en")?.name ||
      genData.name;
    const regionName = genData.main_region.name;

    // Get generation color scheme based on generation
    const getGenerationGradient = (id: string) => {
    const gradients: { [key: string]: string } = {
      "1": "from-red-600 via-yellow-400 to-blue-600",
      "2": "from-yellow-500 via-green-400 to-blue-700",
      "3": "from-green-600 via-teal-400 to-blue-600",
      "4": "from-blue-700 via-purple-500 to-pink-500",
      "5": "from-gray-800 via-gray-600 to-gray-300",
      "6": "from-blue-600 via-red-500 to-yellow-400",
      "7": "from-yellow-400 via-orange-500 to-blue-500",
      "8": "from-purple-700 via-blue-500 to-red-500",
      "9": "from-red-600 via-orange-500 to-purple-700",
    };
      return gradients[id] || "from-blue-500 to-purple-500";
    };

    return (
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-12">
          <div
            className={`absolute -z-10 inset-0 blur-3xl opacity-20 rounded-full bg-gradient-to-r ${getGenerationGradient(
              params.id
            )}`}
          ></div>

          <div className="text-center">
            <Button variant="ghost" className="rounded-full mb-6 group" asChild>
              <Link href="/generations">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Generations
              </Link>
            </Button>
            <h1
              className={`text-5xl md:text-7xl font-bold p-2 mb-4 bg-gradient-to-r ${getGenerationGradient(
                params.id
              )} bg-clip-text text-transparent capitalize`}
            >
              {regionName} Region
            </h1>
            <p className="text-2xl text-muted-foreground mb-6">
              {generationName}
            </p>{" "}
            {/* Stats Cards - Simple and Clean */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
              <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Star className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold text-foreground">
                    {totalCount}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Pokémon</p>
                </CardContent>
              </Card>

              <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold text-foreground capitalize">
                    {regionName}
                  </p>
                  <p className="text-sm text-muted-foreground">Region</p>
                </CardContent>
              </Card>

              <Card className="border border-border/50 shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <Calendar className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-2xl font-bold text-foreground">
                    Gen {params.id}
                  </p>
                  <p className="text-sm text-muted-foreground">Generation</p>
                </CardContent>
              </Card>
            </div>
            {/* Version Games */}
            {genData.version_groups && genData.version_groups.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3">Featured Games</h3>
                <div className="flex flex-wrap gap-2 justify-center">
                  {genData.version_groups
                    .slice(0, 4)
                    .map((vg: any, index: number) => (
                      <Badge
                        key={vg.name}
                        variant="secondary"
                        className="capitalize px-3 py-1 text-sm hover:scale-105 transition-transform"
                      >
                        {vg.name.replace("-", " ")}
                      </Badge>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>{" "}
        {/* Pokemon Grid Section */}
        <GenerationPokemonGrid
          initialPokemon={pokemonData}
          generationId={Number(params.id)}
          totalCount={totalCount}
        />
      </main>
    );
  } catch (error) {
    console.error("Error fetching generation:", error);
    notFound();
  }
}
