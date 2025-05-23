"use client";
import { PokemonGrid } from "@/components/pokemon-grid";
import { SearchBar } from "@/components/search-bar";
import { fetchPokemon } from "@/lib/pokemon";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
	const pokemonData = await fetchPokemon(1, 8); // Reduced to show fewer on homepage

	return (
		<main className="container mx-auto px-4 py-8">
			<section className="py-12 md:py-20 flex flex-col items-center justify-center text-center">
				<div className="relative mb-8">
					<div className="absolute -z-10 inset-0 blur-3xl opacity-20 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500"></div>
					<h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">
						PokeDex Explorer
					</h1>
				</div>
				<p className="text-xl text-muted-foreground max-w-2xl mb-8">
					Your ultimate guide to the world of Pokémon. Discover, learn, and
					explore all Pokémon species in one place.
				</p>

				<div className="mb-12 w-full max-w-lg">
					<SearchBar />
				</div>

				<div className="flex flex-wrap gap-4 justify-center">
					<Button size="lg" className="rounded-full" asChild>
						<Link href="/pokedex">
							Browse PokeDex
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
					<Button size="lg" variant="outline" className="rounded-full" asChild>
						<Link href="/types">Explore by Type</Link>
					</Button>
				</div>
			</section>

			<section className="py-16 border-t">
				<div className="flex flex-col md:flex-row justify-between items-center mb-8">
					<h2 className="text-3xl font-bold">Featured Pokémon</h2>
					<Button variant="ghost" className="rounded-full" asChild>
						<Link href="/pokedex">
							View All
							<ArrowRight className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>

				<PokemonGrid initialPokemon={pokemonData} />
			</section>

			<section className="py-16 border-t">
				<div className="grid md:grid-cols-2 gap-8 items-center">
					<div>
						<h2 className="text-3xl font-bold mb-4">Comprehensive PokeDex</h2>
						<p className="text-muted-foreground mb-6">
							Access detailed information about every Pokémon, including stats,
							abilities, evolutions, and more. Our PokeDex is designed to be
							your ultimate Pokémon reference guide.
						</p>
						<ul className="space-y-2 mb-6">
							<li className="flex items-center">
								<div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
								<span>Detailed stats and abilities</span>
							</li>
							<li className="flex items-center">
								<div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
								<span>Evolution chains</span>
							</li>
							<li className="flex items-center">
								<div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
								<span>Type effectiveness</span>
							</li>
							<li className="flex items-center">
								<div className="h-2 w-2 rounded-full bg-primary mr-2"></div>
								<span>Move lists and descriptions</span>
							</li>
						</ul>
						<Button className="rounded-full" asChild>
							<Link href="/pokedex">
								Open PokeDex
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</Button>
					</div>
					<div className="flex justify-center">
						<div className="relative" style={{ width: 900, height: 350 }}>
							<div className="absolute -z-10 inset-0 blur-3xl opacity-20 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 dark:from-blue-700 dark:via-green-700 dark:to-yellow-600"></div>
							<Image
								src="/all-pokemon.svg"
								alt="PokeDex Explorer"
								fill
								className="float-animation"
								sizes="(max-width: 768px) 100vw, 350px"
								priority
								style={{
									filter:
										"drop-shadow(0 0 24px #60a5fa) drop-shadow(0 0 8px #facc15)",
									// Add color inversion for dark mode
									// Next.js doesn't support prefers-color-scheme in style prop, so use Tailwind below
								}}
							/>
							<style jsx global>{`
								@media (prefers-color-scheme: dark) {
									img[alt="PokeDex Explorer"] {
										filter: invert(1) hue-rotate(180deg)
											drop-shadow(0 0 24px #2563eb) drop-shadow(0 0 8px #fde047);
									}
								}
							`}</style>
						</div>
					</div>
				</div>
			</section>
		</main>
	);
}
