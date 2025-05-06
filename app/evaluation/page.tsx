import { MainLayout } from "@/components/layouts/main-layout"
import { ConfusionMatrix } from "@/components/evaluation/confusion-matrix"

export default function EvaluationPage() {
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-semibold text-center mb-12">Customer Churn Prediction</h1>
        <ConfusionMatrix />
      </div>
    </MainLayout>
  )
}
