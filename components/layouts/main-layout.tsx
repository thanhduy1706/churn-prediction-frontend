"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { motion } from "framer-motion"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-300">
      <motion.header
        className="border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              className="font-semibold text-xl"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <span className="block">churn</span>
              <span className="block">prediction</span>
            </motion.div>
          </Link>
          <nav className="flex items-center space-x-8">
            <Link
              href="/"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors relative",
                pathname === "/" || pathname.includes("/prediction")
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary",
              )}
            >
              {(pathname === "/" || pathname.includes("/prediction")) && (
                <motion.span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" layoutId="underline" />
              )}
              Prediction
            </Link>
            <Link
              href="/visualization"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors relative",
                pathname.includes("/visualization") ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {pathname.includes("/visualization") && (
                <motion.span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" layoutId="underline" />
              )}
              Visualization
            </Link>
            <Link
              href="/evaluation"
              className={cn(
                "px-3 py-2 text-sm font-medium transition-colors relative",
                pathname.includes("/evaluation") ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {pathname.includes("/evaluation") && (
                <motion.span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" layoutId="underline" />
              )}
              Evaluation
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </motion.header>
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
