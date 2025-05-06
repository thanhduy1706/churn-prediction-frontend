import { MainLayout } from "@/components/layouts/main-layout"
import { ResultsContent } from "@/components/results/results-content"

export default function ResultsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-12">Customer Churn Prediction</h1>
        <ResultsContent />
      </div>
    </MainLayout>
  )
}
