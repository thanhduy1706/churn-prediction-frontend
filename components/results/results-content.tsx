"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ResultsContent() {
  return (
    <motion.div
      className="max-w-4xl mx-auto bg-card p-8 rounded-xl border shadow-sm dark:shadow-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="text-center space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.h2
          className="text-4xl font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          Your results are ready!
        </motion.h2>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground">See detailed result</p>
          <div className="flex justify-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="default"
                asChild
                className="rounded-full"
              >
                <Link href="/visualization">Visualization</Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant="default"
                asChild
                className="rounded-full"
              >
                <Link href="/evaluation">Evaluation</Link>
              </Button>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-sm text-muted-foreground mb-2">Or</p>
          <motion.div whileHover={{ scale: 1.05 }}>
            <Button
              variant="outline"
              asChild
              className="rounded-full"
            >
              <Link href="/">Start New</Link>
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  )
}
