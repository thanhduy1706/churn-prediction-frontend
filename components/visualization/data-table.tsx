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
import { useState, useEffect, useMemo, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Search, Maximize2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ConfigProvider, Modal, theme as antdTheme, Skeleton } from "antd"
import { useTheme } from "next-themes"
import { LoadingBar } from "@/components/ui/loading-bar"

interface DataTableProps {
  csvData?: string
}

export function DataTable({ csvData }: DataTableProps) {
  const [parsedData, setParsedData] = useState<{ [key: string]: string }[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isFullTableLoading, setIsFullTableLoading] = useState(false)
  const [displayedRows, setDisplayedRows] = useState<
    { [key: string]: string }[]
  >([])
  const [hasMore, setHasMore] = useState(true)
  const observerTarget = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const ROWS_PER_PAGE = 8
  const INITIAL_LOAD_COUNT = 50
  const LOAD_MORE_COUNT = 50
  const { darkAlgorithm, defaultAlgorithm } = antdTheme

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

  const loadMoreData = useCallback(() => {
    if (!hasMore || isFullTableLoading) return

    setIsFullTableLoading(true)
    const currentLength = displayedRows.length
    const nextData = filteredData.slice(
      currentLength,
      currentLength + LOAD_MORE_COUNT
    )

    // Simulate network delay for better UX
    setTimeout(() => {
      if (nextData.length === 0) {
        setHasMore(false)
        setIsFullTableLoading(false)
        return
      }

      setDisplayedRows((prev) => [...prev, ...nextData])
      setIsFullTableLoading(false)
    }, 300)
  }, [filteredData, displayedRows.length, hasMore, isFullTableLoading])

  useEffect(() => {
    if (isModalOpen) {
      setDisplayedRows(filteredData.slice(0, INITIAL_LOAD_COUNT))
      setHasMore(filteredData.length > INITIAL_LOAD_COUNT)
    } else {
      setDisplayedRows([])
      setHasMore(true)
    }
  }, [isModalOpen, filteredData])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFullTableLoading) {
          loadMoreData()
        }
      },
      {
        threshold: 0.1,
        rootMargin: "100px",
      }
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMoreData, hasMore, isFullTableLoading])

  const handleOpenModal = () => {
    setIsModalOpen(true)
    setIsFullTableLoading(true)
    setTimeout(() => {
      setIsFullTableLoading(false)
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
                  className="text-wrap"
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

      <div className="flex items-center justify-between p-2 border-t">
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

      <ConfigProvider
        theme={{
          algorithm: theme === "dark" ? darkAlgorithm : defaultAlgorithm,
          components: {
            Modal: {
              contentBg: theme === "dark" ? "hsl(var(--background))" : "#fff",
              headerBg: theme === "dark" ? "hsl(var(--background))" : "#fff",
              colorText:
                theme === "dark"
                  ? "hsl(var(--foreground))"
                  : "rgba(0, 0, 0, 0.88)",
              colorIcon:
                theme === "dark"
                  ? "hsl(var(--foreground))"
                  : "rgba(0, 0, 0, 0.88)",
              colorIconHover:
                theme === "dark" ? "hsl(var(--primary))" : "#1677ff",
            },
          },
        }}
      >
        <Modal
          title="Full Table View"
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
          width="90%"
          footer={null}
          styles={{
            body: {
              padding: "16px",
              maxHeight: "calc(100vh - 150px)",
              overflow: "hidden",
            },
          }}
        >
          <div
            className={`h-full ${theme === "dark" ? "text-foreground" : ""}`}
          >
            {isFullTableLoading && displayedRows.length === 0 ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {headers.map((_, index) => (
                    <Skeleton.Input
                      key={index}
                      active
                      size="small"
                      style={{ width: 120 }}
                    />
                  ))}
                </div>
                {[...Array(10)].map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className="flex items-center space-x-4"
                  >
                    {headers.map((_, colIndex) => (
                      <Skeleton.Input
                        key={colIndex}
                        active
                        size="small"
                        style={{ width: 100 }}
                      />
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={`${
                  theme === "dark" ? "bg-background text-foreground" : ""
                }`}
                style={{ maxHeight: "calc(100vh - 300px)", overflow: "auto" }}
              >
                <Table>
                  <TableHeader>
                    <TableRow>
                      {headers.map((header, index) => (
                        <TableHead
                          key={index}
                          className={`text-wrap ${
                            theme === "dark"
                              ? "bg-background text-foreground"
                              : "bg-background"
                          }`}
                          style={{
                            zIndex: 10,
                            backgroundColor:
                              theme === "dark"
                                ? "hsl(var(--background))"
                                : "#fff",
                            borderBottom: "1px solid hsl(var(--border))",
                          }}
                        >
                          {header}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <tbody className={theme === "dark" ? "bg-background" : ""}>
                    {displayedRows.map((row, index) => (
                      <tr
                        key={index}
                        className={`border-b hover:bg-muted/50 ${
                          theme === "dark"
                            ? "bg-background text-foreground"
                            : ""
                        }`}
                      >
                        {headers.map((header, cellIndex) => (
                          <TableCell
                            key={cellIndex}
                            className={`whitespace-nowrap ${
                              theme === "dark"
                                ? "bg-background text-foreground"
                                : ""
                            }`}
                          >
                            {row[header]}
                          </TableCell>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
                {hasMore && (
                  <div
                    ref={observerTarget}
                    className="h-10 flex items-center justify-center relative"
                  >
                    {isFullTableLoading && (
                      <div className="w-full px-4 z-50 absolute bottom-0">
                        <LoadingBar
                          loading={true}
                          width="100%"
                          height={5}
                          speedMultiplier={0.8}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      </ConfigProvider>
    </motion.div>
  )
}
