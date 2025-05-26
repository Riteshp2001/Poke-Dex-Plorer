import { getTypeColorClass } from "@/lib/pokemon";
import { ImageResponse } from "next/og";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default async function Icon({ params }: { params: { id: string } }) {
	// Determine the background color based on the Pokémon's type
	const slug = await params.id;
	console.log("Generating icon for Pokémon:", slug);

	const parts = slug.split("-");
	if (parts.length < 2) {
		throw new Error(
			`Invalid 'id' format: ${slug}. Expected format 'name-type-id'.`
		);
	}

	const pokemonType = parts[1];
	const background = getTypeColorClass(pokemonType) || "#cccccc"; // Default to a neutral color if undefined

	if (!background) {
		throw new Error(`No background found for type: ${pokemonType}`);
	}

	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					fontSize: "20px",
					background,
					border: "2px solid black",
					borderRadius: "50%",
					width: "100%",
					height: "100%",
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					color: "black",
					fontWeight: "bold",
					position: "relative",
				}}
			>
				{/* Pokéball button outer */}
				<div
					style={{
						width: "12px",
						height: "12px",
						backgroundColor: "white",
						border: "2px solid black",
						borderRadius: "50%",
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
					}}
				></div>
			</div>
		),
		// ImageResponse options
		{
			...size,
		}
	);
}
