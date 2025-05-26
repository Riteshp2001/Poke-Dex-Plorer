import PokemonTabs from "@/components/pokemon-tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	fetchPokemonById,
	fetchPokemonSpecies,
	getBackgroundByType,
} from "@/lib/pokemon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { id: string } }) {
	try {
		const slug = (await params).id; // Await params before accessing its properties
		const id = parseInt(slug.split("-").pop() || "");
		console.log("Generating metadata for Pokémon ID:", id);
		if (isNaN(id)) {
			notFound();
		}
		const pokemon = await fetchPokemonById(id);
		const imageUrl =
			pokemon.sprites.other["official-artwork"].front_default ||
			"/all-pokemon.svg";
		return {
			title: `${
				pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
			} | PokeDex Explorer`,
			description: `Learn all about ${pokemon.name} - stats, abilities, moves, and more. Explore with PokeDex Explorer by Ritesh Pandit, creative web developer.`,
			authors: [
				{ name: "Ritesh Pandit", url: "https://riteshdpandit.vercel.app" },
			],
			creator: "Ritesh Pandit",
			openGraph: {
				title: `${
					pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
				} | PokeDex Explorer`,
				description: `Learn all about ${pokemon.name} - stats, abilities, moves, and more. Explore with PokeDex Explorer by Ritesh Pandit, creative web developer.`,
				images: [
					{
						url: imageUrl,
						width: 1200,
						height: 630,
						alt: `${pokemon.name} official artwork`,
					},
				],
			},
		};
	} catch (error) {
		return {
			title: "Pokémon Not Found | PokeDex Explorer",
			description: "The requested Pokémon could not be found.",
			authors: [
				{ name: "Ritesh Pandit", url: "https://riteshdpandit.vercel.app" },
			],
			creator: "Ritesh Pandit",
		};
	}
}

export default async function PokemonPage({
	params,
}: {
	params: { id: string }; // id is now name-id string
}) {
	try {
		const { id: slug } = await params; // Await params before accessing its properties
		const parts = slug.split("-");
		const idString = parts.pop();

		if (!idString) {
			console.error("Could not extract ID from slug:", slug);
			notFound();
		}

		const id = Number.parseInt(idString);

		if (isNaN(id)) {
			console.error("Parsed ID is NaN from slug:", slug);
			notFound();
		}

		const pokemon = await fetchPokemonById(id);
		const species = await fetchPokemonSpecies(id);

		const englishFlavorText =
			species.flavor_text_entries
				.find((entry: any) => entry.language.name === "en")
				?.flavor_text.replace(/\f/g, " ")
				.replace(/\u00ad\n/g, "")
				.replace(/\u00ad/g, "")
				.replace(/\n/g, " ") || "No description available.";

		const prevId = id > 1 ? id - 1 : null;
		const nextId = id < 1010 ? id + 1 : null; // Assuming 1010 is max, adjust if needed

		// Get previous/next pokemon data for name in slug
		let prevPokemonName = "";
		if (prevId) {
			const prevPokemon = await fetchPokemonById(prevId);
			prevPokemonName = prevPokemon.name.toLowerCase();
		}
		let nextPokemonName = "";
		if (nextId) {
			const nextPokemon = await fetchPokemonById(nextId);
			nextPokemonName = nextPokemon.name.toLowerCase();
		}

		// Get background gradient based on Pokemon's primary type
		const primaryType = pokemon.types[0]?.type.name || "normal";
		const bgGradient = getBackgroundByType(primaryType);

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
						{prevId && prevPokemonName && (
							<Button
								variant="outline"
								size="icon"
								className="rounded-full"
								asChild
							>
								<Link href={`/pokedex/${prevPokemonName}-${prevId}`}>
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Previous Pokémon</span>
								</Link>
							</Button>
						)}

						{nextId && nextPokemonName && (
							<Button
								variant="outline"
								size="icon"
								className="rounded-full"
								asChild
							>
								<Link href={`/pokedex/${nextPokemonName}-${nextId}`}>
									<ChevronRight className="h-4 w-4" />
									<span className="sr-only">Next Pokémon</span>
								</Link>
							</Button>
						)}
					</div>
				</div>

				<div className="grid md:grid-cols-2 gap-8">
					<div
						className={`rounded-3xl p-8 flex items-center justify-center bg-gradient-to-br ${bgGradient} shadow-lg`}
					>
						<Image
							src={
								pokemon.sprites.other["official-artwork"].front_default ||
								"/placeholder.svg"
							}
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
								{pokemon.types.map((type: any) => (
									<span
										key={type.type.name}
										className={`pokemon-type type-${type.type.name} px-4 py-1.5 text-sm`}
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
							<p className="text-lg">{englishFlavorText}</p>
						</div>

						<div className="grid grid-cols-2 gap-6">
							<Card className="border-0 shadow-md">
								<CardContent className="p-4">
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Height
									</h3>
									<p className="text-2xl font-medium">
										{pokemon.height / 10} m
									</p>
								</CardContent>
							</Card>
							<Card className="border-0 shadow-md">
								<CardContent className="p-4">
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Weight
									</h3>
									<p className="text-2xl font-medium">
										{pokemon.weight / 10} kg
									</p>
								</CardContent>
							</Card>
							<Card className="border-0 shadow-md">
								<CardContent className="p-4">
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Abilities
									</h3>
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
									<h3 className="text-sm font-medium text-muted-foreground mb-2">
										Base Experience
									</h3>
									<p className="text-2xl font-medium">
										{pokemon.base_experience || "Unknown"}
									</p>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>

				<PokemonTabs pokemon={pokemon} />
			</div>
		);
	} catch (error) {
		console.error("Error fetching pokemon:", error);
		notFound();
	}
}
