"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipProps,
} from "recharts"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Papa, { ParseResult } from "papaparse"

interface HistogramProps {
  csvData?: string
}

interface ChartDataItem {
  name: string;
  value: number;
}

const COLORS = {
  barYes: "#edfcca", // Pastel green
  barNo: "#fee4e5", // Pastel pink
  grid: "#E5E7EB", // Light gray for grid
  text: "#4B5563", // Gray for text
}

export function HistogramComponent({ csvData }: HistogramProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>(
    []
  )
  const [total, setTotal] = useState(0)

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

            const totalCount = Object.values(churnCounts).reduce((sum, count) => sum + count, 0)
            setTotal(totalCount)
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

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const count = item.value as number;
      const percentage = ((count / total) * 100).toFixed(1);
      const isChurn = label === "Yes";

      return (
        <div className="bg-white/70 p-2 rounded-md shadow-md border border-gray-100 backdrop-blur-sm">
          <p className="font-medium text-sm mb-1 text-gray-600 dark:text-gray-900">
            {isChurn ? "Churned Customers" : "Retained Customers"}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-900">
            Count: <span className="font-semibold">{count}</span>
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-900">
            Percentage: <span className="font-semibold">{percentage}%</span>
          </p>
        </div>
      );
    }
    return null;
  };

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
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="value"
            radius={[4, 4, 0, 0]}
            animationDuration={1500}
            animationBegin={300}
            className="drop-shadow-md"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.name === "Yes" ? COLORS.barYes : COLORS.barNo}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
