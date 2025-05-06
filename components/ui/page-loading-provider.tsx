"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { LoadingBar } from "./loading-bar"

interface PageLoadingContextType {
  isLoading: boolean
  setLoading: (loading: boolean) => void
}

const PageLoadingContext = createContext<PageLoadingContextType>({
  isLoading: false,
  setLoading: () => {},
})

export const usePageLoading = () => useContext(PageLoadingContext)

export function PageLoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setLoading] = useState(true)
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Show loading bar on initial page load
  useEffect(() => {
    // Simulate initial page load
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Show loading bar on route changes
  useEffect(() => {
    setLoading(true)
    const timer = setTimeout(() => {
      setLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [pathname, searchParams])

  return (
    <PageLoadingContext.Provider value={{ isLoading, setLoading }}>
      <LoadingBar loading={isLoading} className="fixed top-0 left-0 z-50 w-full" />
      <div
        className={
          isLoading ? "opacity-70 transition-opacity duration-300" : "opacity-100 transition-opacity duration-300"
        }
      >
        {children}
      </div>
    </PageLoadingContext.Provider>
  )
}
