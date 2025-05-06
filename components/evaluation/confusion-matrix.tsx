"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export function ConfusionMatrix() {
  return (
    <motion.div
      className="max-w-5xl mx-auto bg-card p-8 rounded-xl border shadow-sm dark:shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="flex items-center mb-8"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
      >
        <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
          <Button variant="ghost" size="sm" asChild className="gap-1">
            <Link href="/results">
              <ArrowLeft className="h-4 w-4" />
              Go back
            </Link>
          </Button>
        </motion.div>
        <h2 className="text-2xl font-medium mx-auto">Confusion Matrix</h2>
      </motion.div>

      <motion.div
        className="flex justify-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.div
          className="w-[400px] h-[400px] border grid grid-cols-2 grid-rows-2 rounded-md overflow-hidden bg-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            className="border flex items-center justify-center bg-green-100 dark:bg-green-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <span className="text-2xl font-semibold">75%</span>
          </motion.div>
          <motion.div
            className="border flex items-center justify-center bg-red-100 dark:bg-red-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            <span className="text-2xl font-semibold">8%</span>
          </motion.div>
          <motion.div
            className="border flex items-center justify-center bg-red-100 dark:bg-red-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.3 }}
          >
            <span className="text-2xl font-semibold">5%</span>
          </motion.div>
          <motion.div
            className="border flex items-center justify-center bg-green-100 dark:bg-green-900/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.3 }}
          >
            <span className="text-2xl font-semibold">12%</span>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
