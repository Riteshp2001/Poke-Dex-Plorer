import { ImageResponse } from "next/og";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
	return new ImageResponse(
		(
			// ImageResponse JSX element
			<div
				style={{
					fontSize: "20px",
					background: "radial-gradient(circle, red 50%, white 50%)",
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
