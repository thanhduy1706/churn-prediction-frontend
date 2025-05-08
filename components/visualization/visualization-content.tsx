"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PieChart, BarChart } from "lucide-react"
import { DataTable } from "@/components/visualization/data-table"
import { PieChartComponent } from "@/components/visualization/pie-chart"
import { HistogramComponent } from "@/components/visualization/histogram"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"
import { loadCSVFile } from "@/lib/utils/csv-loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

type ChartType = "pie" | "histogram"

export function VisualizationContent() {
  const [csvData, setCsvData] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chartType, setChartType] = useState<ChartType>("pie")

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true)
        const data = await loadCSVFile("churn_data.csv")
        setCsvData(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load data")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="h-[90vh] flex flex-col">
      <motion.div
        className="flex-none px-6 py-4 border-b"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="container max-w-7xl mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-2 hover:bg-accent"
          >
            <Link href="/results">
              <ArrowLeft className="h-4 w-4" />
              Back to Results
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Data Visualization</h1>
          <div className="w-[100px]" /> {/* Spacer for balance */}
        </div>
      </motion.div>

      <div className="flex-1 overflow-hidden p-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-9">
            <Card className=" flex flex-col">
              <CardHeader className="flex-none">
                <CardTitle>Dataset Preview</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-auto">
                {isLoading ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-8 w-full" />
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                ) : (
                  <DataTable csvData={csvData} />
                )}
              </CardContent>
            </Card>

            <Card className="h-full flex flex-col">
              <CardHeader className="flex-none">
                <div className="flex items-center justify-between">
                  <CardTitle>Prediction Rate</CardTitle>
                  <Tabs
                    defaultValue={chartType}
                    onValueChange={(value) => setChartType(value as ChartType)}
                    className="w-[300px]"
                  >
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger
                        value="pie"
                        className="flex items-center gap-2"
                      >
                        <PieChart className="h-4 w-4" />
                        <span>Pie Chart</span>
                      </TabsTrigger>
                      <TabsTrigger
                        value="histogram"
                        className="flex items-center gap-2"
                      >
                        <BarChart className="h-4 w-4" />
                        <span>Histogram</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                {isLoading ? (
                  <Skeleton className="h-[calc(100%-2rem)] w-full" />
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to load visualization
                    </AlertDescription>
                  </Alert>
                ) : chartType === "pie" ? (
                  <PieChartComponent csvData={csvData} />
                ) : (
                  <HistogramComponent csvData={csvData} />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
