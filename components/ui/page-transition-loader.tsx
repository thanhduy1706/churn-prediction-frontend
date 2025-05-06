"use client"

import { useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { BarLoader } from "react-spinners"
import { useTheme } from "next-themes"

export function PageTransitionLoader() {
  const [isLoading, setIsLoading] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  // Default color based on theme
  const loaderColor = theme === "dark" ? "#ffffff" : "#000000"

  useEffect(() => {
    // Show loading bar when route changes
    const handleRouteChangeStart = () => {
      setIsLoading(true)
    }

    // Hide loading bar after a short delay to ensure smooth transition
    const handleRouteChangeComplete = () => {
      const timeout = setTimeout(() => {
        setIsLoading(false)
      }, 300)

      return () => clearTimeout(timeout)
    }

    // Simulate route change start
    handleRouteChangeStart()

    // Simulate route change complete
    const timeout = setTimeout(handleRouteChangeComplete, 500)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <BarLoader color={loaderColor} loading={true} height={4} width="100%" speedMultiplier={1.2} />
    </div>
  )
}
