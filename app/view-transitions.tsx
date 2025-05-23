"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"

// This component enables View Transitions API
export function ViewTransitions() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check if the browser supports the View Transitions API
    if (!(document as any).startViewTransition) {
      return
    }

    const handleNavigate = (url: string) => {
      // Don't intercept if it's an external link or a download
      if (
        (url.startsWith("http") && !url.startsWith(window.location.origin)) ||
        url.includes("#") ||
        url.includes("download")
      ) {
        return
      }
      // Start view transition
      ;(document as any).startViewTransition(() => {
        // This is where the actual navigation happens
        window.history.pushState({}, "", url)
        // Force a re-render
        window.dispatchEvent(new Event("popstate"))
      })
    }

    // Intercept link clicks
    document.addEventListener("click", (e) => {
      const target = e.target as HTMLElement
      const link = target.closest("a")

      if (
        link &&
        link.href &&
        link.href.startsWith(window.location.origin) &&
        !link.hasAttribute("download") &&
        !link.hasAttribute("target")
      ) {
        e.preventDefault()
        handleNavigate(link.href)
      }
    })
  }, [])

  // Re-render on route changes
  useEffect(() => {
    // This effect runs when the route changes
  }, [pathname, searchParams])

  return null
}
