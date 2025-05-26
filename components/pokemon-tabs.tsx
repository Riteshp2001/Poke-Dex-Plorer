"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";
import { PokemonEvolutions } from "./pokemon-evolutions";
import { Card, CardContent } from "./ui/card";
import Image from "next/image";
import { getBackgroundByType, getStatColorClass } from "@/lib/pokemon";
import clsx from "clsx";

export default function PokemonTabs({ pokemon }: { pokemon: any }) {
	const [activeTab, setActiveTab] = useState<
		"stats" | "moves" | "evolution" | "sprites"
	>("stats");

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
				<Card className="border-0 rounded-2xl shadow-xl bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md transition-colors">
					<CardContent className="p-6 space-y-4">
						<h3 className="text-lg font-semibold text-zinc-700 dark:text-zinc-200">
							Base Stats
						</h3>
						<div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
							{pokemon.stats?.map((stat: any) => {
								const baseStat = stat?.base_stat ?? 0;
								const statNameRaw = stat?.stat?.name ?? "unknown";
								const statName = statNameRaw.replace(/-/g, " ");

								return (
									<div
										key={statNameRaw}
										className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/30 dark:bg-muted/50 shadow-inner hover:shadow-md transition"
									>
										<span className="text-sm font-medium capitalize text-zinc-600 dark:text-zinc-300">
											{statName}
										</span>
										<span className="text-2xl font-bold text-zinc-800 dark:text-zinc-100 tabular-nums">
											{baseStat}
										</span>
									</div>
								);
							})}
						</div>
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
