"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { BarLoader } from "react-spinners"
import { useTheme } from "next-themes"

interface PageTransitionContextType {
  isTransitioning: boolean
}

const PageTransitionContext = createContext<PageTransitionContextType>({
  isTransitioning: false,
})

export const usePageTransition = () => useContext(PageTransitionContext)

export function PageTransitionProvider({ children }: { children: React.ReactNode }) {
  const [isTransitioning, setIsTransitioning] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { theme } = useTheme()

  // Default color based on theme
  const loaderColor = theme === "dark" ? "#ffffff" : "#000000"

  useEffect(() => {
    // Show loading bar when route changes
    setIsTransitioning(true)

    // Hide loading bar after a short delay
    const timeout = setTimeout(() => {
      setIsTransitioning(false)
    }, 800)

    return () => clearTimeout(timeout)
  }, [pathname, searchParams])

  return (
    <PageTransitionContext.Provider value={{ isTransitioning }}>
      {isTransitioning && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-transparent">
          <BarLoader color={loaderColor} loading={true} height={4} width="100%" speedMultiplier={1.2} />
        </div>
      )}
      {children}
    </PageTransitionContext.Provider>
  )
}
