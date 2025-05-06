"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import LoadingBar from "react-top-loading-bar"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    setLoadingProgress(30)
    const timer = setTimeout(() => {
      setLoadingProgress(100)
    }, 500)
    return () => clearTimeout(timer)
  }, [pathname])

  const navLinks = (
    <>
      <Link
        href="/"
        className={cn(
          "px-3 py-2 text-sm font-medium transition-colors relative",
          pathname === "/" || pathname.includes("/prediction")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
        onClick={() => setMobileOpen(false)}
      >
        {(pathname === "/" || pathname.includes("/prediction")) && (
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
            layoutId="underline"
          />
        )}
        Prediction
      </Link>
      <Link
        href="/visualization"
        className={cn(
          "px-3 py-2 text-sm font-medium transition-colors relative",
          pathname.includes("/visualization")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
        onClick={() => setMobileOpen(false)}
      >
        {pathname.includes("/visualization") && (
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
            layoutId="underline"
          />
        )}
        Visualization
      </Link>
      <Link
        href="/evaluation"
        className={cn(
          "px-3 py-2 text-sm font-medium transition-colors relative",
          pathname.includes("/evaluation")
            ? "text-primary"
            : "text-muted-foreground hover:text-primary"
        )}
        onClick={() => setMobileOpen(false)}
      >
        {pathname.includes("/evaluation") && (
          <motion.span
            className="absolute bottom-0 left-0 h-0.5 w-full bg-primary"
            layoutId="underline"
          />
        )}
        Evaluation
      </Link>
      <ThemeToggle />
    </>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <LoadingBar
        color="hsl(var(--primary))"
        progress={loadingProgress}
        onLoaderFinished={() => setLoadingProgress(0)}
        className="z-50"
      />
      <motion.header
        className="border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center space-x-2"
          >
            <motion.div
              className="font-semibold text-xl"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="block">churn</span>
              <span className="block">prediction</span>
            </motion.div>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks}
          </nav>
        </div>
      </motion.header>

      {/* Mobile nav panel */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            key="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden border-t bg-background overflow-hidden"
          >
            <div className="px-4 py-2 flex flex-col space-y-2">{navLinks}</div>
          </motion.nav>
        )}
      </AnimatePresence>

      <main className="flex-1 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full"
        >
          {children}
        </motion.div>
      </main>
    </div>
  )
}
