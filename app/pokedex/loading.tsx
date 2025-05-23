export default function Loading() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-[#09090b] font-sans">
			<style>
				{`
				@keyframes pokeball-spin {
					0% { transform: rotate(0deg); }
					100% { transform: rotate(360deg); }
				}
				@keyframes pokeball-pulse {
					0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.7); }
					50% { box-shadow: 0 0 0 8px rgba(239,68,68,0); }
				}
				`}
			</style>
			<div
				className="relative w-16 h-16"
				style={{
					animation: "pokeball-spin 1.2s linear infinite",
				}}
			>
				{/* Pokeball top (red) */}
				<div className="absolute top-0 left-0 w-full h-1/2 rounded-t-full bg-red-500 border-t-4 border-x-4 border-black dark:border-white"></div>
				{/* Pokeball bottom (white) */}
				<div className="absolute bottom-0 left-0 w-full h-1/2 rounded-b-full bg-white dark:bg-gray-200 border-b-4 border-x-4 border-black dark:border-white"></div>
				{/* Pokeball center black line */}
				<div className="absolute top-1/2 left-0 w-full h-1 border-t-4 border-black dark:border-white -translate-y-1/2"></div>
				{/* Pokeball button outer */}
				<div
					className="absolute top-1/2 left-1/2 w-6 h-6 bg-white dark:bg-gray-200 border-2 border-black dark:border-white rounded-full -translate-x-1/2 -translate-y-1/2 z-10"
					style={{
						animation: "pokeball-pulse 1.2s infinite",
					}}
				></div>
				{/* Pokeball button inner */}
				<div className="absolute top-1/2 left-1/2 w-3 h-3 bg-white dark:bg-gray-200 border-2 border-black dark:border-white rounded-full -translate-x-1/2 -translate-y-1/2 z-20"></div>
			</div>
			<p className="mt-5 text-lg text-gray-800 dark:text-gray-100 animate-pulse">
				Loading Pokémon...
			</p>
		</div>
	);
}
