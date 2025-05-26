import type React from "react";
import "@/styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { BASE_URL } from "@/lib/pokemon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: {
		default: "PokeDex Explorer",
		template: "%s | PokeDex Explorer",
	},
	description:
		"PokeDex Explorer by Ritesh Pandit. Explore, search, and learn about every Pokémon with rich visuals, stats, and evolution details. Built by a creative web developer. Portfolio: riteshdpandit.vercel.app.",
	authors: [{ name: "Ritesh Pandit", url: "https://riteshdpandit.vercel.app" }],
	creator: "Ritesh Pandit",
	metadataBase: new URL(BASE_URL), // Change to your deployed URL
	openGraph: {
		title: "PokeDex Explorer",
		description:
			"Explore, search, and learn about every Pokémon with rich visuals, stats, and evolution details. By Ritesh Pandit.",
		url: BASE_URL,
		siteName: "PokeDex Explorer",
		images: [
			{
				url: `${BASE_URL}/og?name=PokeDex%20Explorer&image=${encodeURIComponent(
					`${BASE_URL}/all-pokemon.svg`
				)}&type=all`,
				width: 1200,
				height: 630,
				alt: "PokeDex Explorer OG Image",
			},
		],
		locale: "en_US",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "PokeDex Explorer",
		description:
			"Explore, search, and learn about every Pokémon with rich visuals, stats, and evolution details. By Ritesh Pandit.",
		creator: "@riteshdpandit",
		images: [
			`${BASE_URL}/og?name=PokeDex%20Explorer&image=${encodeURIComponent(
				`${BASE_URL}/all-pokemon.svg`
			)}&type=all`,
		],
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<div className="flex min-h-screen flex-col">
						<Header />
						<div className="flex-1">{children}</div>
						<Footer />
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
