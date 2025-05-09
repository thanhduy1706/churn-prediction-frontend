"use client"

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  TooltipProps,
} from "recharts"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import Papa, { ParseResult } from "papaparse"

interface PieChartProps {
  csvData?: string
}

const COLORS = ["#fee4e5", "#edfcca"]

export function PieChartComponent({ csvData }: PieChartProps) {
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

            // Calculate percentages
            const total = Object.values(churnCounts).reduce(
              (sum, count) => sum + count,
              0
            )
            setTotal(total)

            const formattedData = Object.entries(churnCounts).map(
              ([name, value]) => ({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                value,
                percentage: Math.round((value / total) * 100),
              })
            )

            setChartData(formattedData)
          }
        },
        error: (error: Error) => {
          console.error("Error parsing CSV for pie chart:", error)
        },
      })
    }
  }, [csvData])

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const item = payload[0];
      const count = item.value as number;
      const percentage = ((count / total) * 100).toFixed(1);
      const isChurn = item.name === "Yes";

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
      className="flex h-[45vh] w-full"
      initial={{ opacity: 0, rotate: -90 }}
      animate={{
        opacity: isAnimating ? 1 : 0,
        rotate: isAnimating ? 0 : -90,
      }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            outerRadius={180}
            innerRadius={60}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
            animationBegin={300}
            className="drop-shadow-lg"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="#fff"
                strokeWidth={1}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            formatter={(value) => (
              <span className="font-medium inline-flex mt-8">{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
