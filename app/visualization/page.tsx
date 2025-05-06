import { MainLayout } from "@/components/layouts/main-layout"
import { VisualizationContent } from "@/components/visualization/visualization-content"

export default function VisualizationPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-12">Customer Churn Prediction</h1>
        <VisualizationContent />
      </div>
    </MainLayout>
  )
}
