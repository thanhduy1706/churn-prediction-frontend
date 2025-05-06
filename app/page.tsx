"use client"

import { MainLayout } from "@/components/layouts/main-layout"
import { PredictionForm } from "@/components/prediction/prediction-form"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <motion.h1
          className="text-3xl font-semibold text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          Customer Churn Prediction
        </motion.h1>
        <motion.div
          className="max-w-4xl mx-auto bg-card p-8 rounded-xl border shadow-sm dark:shadow-md"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <motion.h2
              className="text-3xl font-medium mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              Get your churn prediction
            </motion.h2>
            <motion.p
              className="text-3xl font-medium text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              in seconds.
            </motion.p>
          </div>
          <PredictionForm />
        </motion.div>
      </div>
    </MainLayout>
  )
}
