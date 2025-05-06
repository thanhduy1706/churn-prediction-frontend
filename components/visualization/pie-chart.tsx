"use client"

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const data = [
  { name: "Group A", value: 400 },
  { name: "Group B", value: 300 },
  { name: "Group C", value: 300 },
  { name: "Group D", value: 200 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export function PieChartComponent() {
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    setIsAnimating(true)
  }, [])

  return (
    <motion.div
      className="w-full h-full"
      initial={{ opacity: 0, rotate: -90 }}
      animate={{
        opacity: isAnimating ? 1 : 0,
        rotate: isAnimating ? 0 : -90,
      }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            animationDuration={1500}
            animationBegin={300}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
