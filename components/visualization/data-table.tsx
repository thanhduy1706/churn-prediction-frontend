"use client"

import { Table, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { motion } from "framer-motion"

const data = [
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
  { col1: "Column 1", col2: "Column 2", col3: "Column 3", col4: "Column 4", col5: "Column 5" },
]

export function DataTable() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <motion.div
      className="border rounded-md overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Column 1</TableHead>
            <TableHead>Column 2</TableHead>
            <TableHead>Column 3</TableHead>
            <TableHead>Column 4</TableHead>
            <TableHead>Column 5</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody variants={container} initial="hidden" animate="show">
          {data.map((row, index) => (
            <motion.tr key={index} variants={item} className="border-b">
              <TableCell>{row.col1}</TableCell>
              <TableCell>{row.col2}</TableCell>
              <TableCell>{row.col3}</TableCell>
              <TableCell>{row.col4}</TableCell>
              <TableCell>{row.col5}</TableCell>
            </motion.tr>
          ))}
        </motion.tbody>
      </Table>
    </motion.div>
  )
}
