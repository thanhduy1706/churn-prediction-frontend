"use client"

import { BarLoader } from "react-spinners"
import { useTheme } from "next-themes"
import { motion } from "framer-motion"

interface LoadingBarProps {
  loading: boolean
  width?: number | string
  height?: number
  color?: string
  speedMultiplier?: number
  className?: string
}

export function LoadingBar({
  loading,
  width = "100%",
  height = 4,
  color,
  speedMultiplier = 1,
  className = "",
}: LoadingBarProps) {
  const { theme } = useTheme()

  // Default colors based on theme
  const defaultColor = theme === "dark" ? "#ffffff" : "#000000"

  return (
    <motion.div
      className={`flex justify-center items-center ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: loading ? 1 : 0 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <BarLoader
        color={color || defaultColor}
        loading={loading}
        height={height}
        width={width}
        speedMultiplier={0.8}
        cssOverride={{
          transition: "all 0.3s ease-in-out",
          animationDuration: "1.2s",
        }}
      />
    </motion.div>
  )
}
