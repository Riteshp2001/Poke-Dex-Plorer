import Link from "next/link"
import { Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-8 md:py-12">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-md">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-gray-800"></div>
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-red-500 to-rose-600 bg-clip-text text-transparent">
            PokeDex Explorer
          </span>
        </div>

        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with Next.js, Tailwind CSS, and the PokeAPI. Data provided by{" "}
          <Link
            href="https://pokeapi.co/"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4"
          >
            PokeAPI
          </Link>
          .
        </p>

        <div className="flex items-center gap-4">
          <Link
            href="https://github.com/yourusername/pokedex-explorer"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4 flex items-center gap-1"
          >
            <Github className="h-5 w-5" />
            <span>GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
