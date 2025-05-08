"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Papa, { ParseResult } from "papaparse"

interface HistogramProps {
  csvData?: string
}

// Pastel color palette
const COLORS = {
  bar: "#BAFFC9", // Pastel green
  grid: "#E5E7EB", // Light gray for grid
  text: "#4B5563", // Gray for text
}

export function HistogramComponent({ csvData }: HistogramProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  )

  useEffect(() => {
    if (csvData) {
      Papa.parse(csvData, {
        header: true,
        complete: (results: ParseResult<{ [key: string]: string }>) => {
          if (results.data && results.data.length > 0) {
            // Count Yes and No values in the Churn column
            const churnCounts = results.data.reduce((acc, row) => {
              const churnValue = row.Churn?.toLowerCase() || ""
              if (churnValue === "yes" || churnValue === "no") {
                acc[churnValue] = (acc[churnValue] || 0) + 1
              }
              return acc
            }, {} as { [key: string]: number })

            // Format data for histogram
            const formattedData = Object.entries(churnCounts).map(
              ([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value,
              })
            )

            setChartData(formattedData)
          }
        },
        error: (error: Error) => {
          console.error("Error parsing CSV for histogram:", error)
        },
      })
    }
  }, [csvData])

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: isAnimating ? 1 : 0,
        y: isAnimating ? 0 : 20,
      }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={COLORS.grid}
            vertical={false}
          />
          <XAxis
            dataKey="name"
            axisLine={{ stroke: COLORS.grid }}
            tick={{ fill: COLORS.text }}
            tickLine={{ stroke: COLORS.grid }}
          />
          <YAxis
            axisLine={{ stroke: COLORS.grid }}
            tick={{ fill: COLORS.text }}
            tickLine={{ stroke: COLORS.grid }}
          />
          <Tooltip
            formatter={(value: number) => [value, "Count"]}
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              border: "none",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="value"
            fill={COLORS.bar}
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
            className="drop-shadow-md"
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
