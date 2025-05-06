import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface PredictionState {
  formData: {
    multipleLines: string | null
    contract: string | null
    paymentMethod: string | null
    onlineSecurity: string | null
    internetService: string | null
    techSupport: string | null
    paperlessBilling: string | null
    totalCharges: number | null
    monthlyCharges: number | null
    tenure: number | null
  }
  result: {
    churnProbability: number | null
    isChurn: boolean | null
  }
}

const initialState: PredictionState = {
  formData: {
    multipleLines: null,
    contract: null,
    paymentMethod: null,
    onlineSecurity: null,
    internetService: null,
    techSupport: null,
    paperlessBilling: null,
    totalCharges: null,
    monthlyCharges: null,
    tenure: null,
  },
  result: {
    churnProbability: null,
    isChurn: null,
  },
}

export const predictionSlice = createSlice({
  name: "prediction",
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<PredictionState["formData"]>>) => {
      state.formData = { ...state.formData, ...action.payload }
    },
    setResult: (state, action: PayloadAction<PredictionState["result"]>) => {
      state.result = action.payload
    },
    resetForm: (state) => {
      state.formData = initialState.formData
      state.result = initialState.result
    },
  },
})

export const { updateFormData, setResult, resetForm } = predictionSlice.actions

export default predictionSlice.reducer
