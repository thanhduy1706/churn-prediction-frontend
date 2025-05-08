"use client"

import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { motion } from "framer-motion"
import Papa, { ParseResult } from "papaparse"
import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Search, Maximize2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Modal } from "antd"
import { LoadingBar } from "@/components/ui/loading-bar"
import { useTheme } from "next-themes"

interface DataTableProps {
  csvData?: string
}

export function DataTable({ csvData }: DataTableProps) {
  const [parsedData, setParsedData] = useState<{ [key: string]: string }[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { theme } = useTheme()
  const ROWS_PER_PAGE = 10

  useEffect(() => {
    if (csvData) {
      Papa.parse(csvData, {
        header: true,
        complete: (results: ParseResult<{ [key: string]: string }>) => {
          if (results.data && results.data.length > 0) {
            setParsedData(results.data)
            setHeaders(Object.keys(results.data[0]))
          }
        },
        error: (error: Error) => {
          console.error("Error parsing CSV:", error)
        },
      })
    }
  }, [csvData])

  // Filter data based on search query
  const filteredData = useMemo(() => {
    if (!searchQuery) return parsedData
    return parsedData.filter((row) =>
      Object.values(row).some((value) =>
        value.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
  }, [parsedData, searchQuery])

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / ROWS_PER_PAGE)
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ROWS_PER_PAGE
    const end = start + ROWS_PER_PAGE
    return filteredData.slice(start, end)
  }, [filteredData, currentPage])

  const handleOpenModal = () => {
    setIsLoading(true)
    setIsModalOpen(true)
    // Simulate loading time for large data
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

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
      className="border rounded-md overflow-hidden bg-background"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="p-2 border-b flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search in table..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenModal}
          className="ml-2"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-scroll">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header, index) => (
                <TableHead
                  key={index}
                  className="text-wrap text-xs"
                >
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <motion.tbody
            variants={container}
            initial="hidden"
            animate="show"
          >
            {paginatedData.map((row, index) => (
              <motion.tr
                key={index}
                variants={item}
                className="border-b hover:bg-muted/50"
              >
                {headers.map((header, cellIndex) => (
                  <TableCell
                    key={cellIndex}
                    className="whitespace-nowrap"
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </motion.tr>
            ))}
          </motion.tbody>
        </Table>
      </div>

      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {(currentPage - 1) * ROWS_PER_PAGE + 1} to{" "}
          {Math.min(currentPage * ROWS_PER_PAGE, filteredData.length)} of{" "}
          {filteredData.length} entries
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="text-sm">
            Page {currentPage} of {totalPages}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Modal
        title="Full Table View"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width="90%"
        footer={null}
        className={theme === "dark" ? "dark" : ""}
        styles={{
          content: {
            backgroundColor:
              theme === "dark" ? "hsl(var(--background))" : "white",
            color: theme === "dark" ? "hsl(var(--foreground))" : "black",
          },
          header: {
            backgroundColor:
              theme === "dark" ? "hsl(var(--background))" : "white",
            color: theme === "dark" ? "hsl(var(--foreground))" : "black",
            borderBottom: `1px solid ${
              theme === "dark" ? "hsl(var(--border))" : "#e5e7eb"
            }`,
          },
        }}
      >
        <LoadingBar loading={isLoading} />
        <div className="overflow-x-auto mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                {headers.map((header, index) => (
                  <TableHead
                    key={index}
                    className="text-wrap text-xs"
                  >
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <tbody>
              {filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-muted/50"
                >
                  {headers.map((header, cellIndex) => (
                    <TableCell
                      key={cellIndex}
                      className="whitespace-nowrap"
                    >
                      {row[header]}
                    </TableCell>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal>
    </motion.div>
  )
}
