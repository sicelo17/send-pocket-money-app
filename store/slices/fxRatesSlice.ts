import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"
import { api } from "@/lib/api"
import type { FXRate } from "@/lib/types"

interface FXRatesState {
  rates: FXRate | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
}

const initialState: FXRatesState = {
  rates: null,
  isLoading: false,
  error: null,
  lastUpdated: null,
}

export const fetchFXRates = createAsyncThunk("fxRates/fetchFXRates", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/InterviewAPIS")
    const data = response.data

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid API response format")
    }

    // Initialize rates object to collect from API response
    const rates: FXRate = {
      USD: 1, // USD is typically the base currency
      GBP: 0,
      ZAR: 0,
      USDT: 0,
    }

    // Extract rates from API response array format
    data.forEach((item: any) => {
      if (typeof item === "object" && item !== null) {
        if (item.USD && typeof item.USD === "number") rates.USD = item.USD
        if (item.GBP && typeof item.GBP === "number") rates.GBP = item.GBP
        if (item.ZAR && typeof item.ZAR === "number") rates.ZAR = item.ZAR
        if (item.USDT && typeof item.USDT === "number") rates.USDT = item.USDT
      }
    })

    // Validate that we got the required rates from API
    if (rates.GBP === 0 || rates.ZAR === 0) {
      throw new Error("Missing required exchange rates from API")
    }

    return rates
  } catch (error: any) {
    console.error("FX Rates API Error:", error)
    return rejectWithValue(error.response?.data?.message || error.message || "Failed to fetch exchange rates")
  }
})

const fxRatesSlice = createSlice({
  name: "fxRates",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFXRates.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchFXRates.fulfilled, (state, action: PayloadAction<FXRate>) => {
        state.isLoading = false
        state.rates = action.payload
        state.lastUpdated = new Date().toISOString()
      })
      .addCase(fetchFXRates.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = fxRatesSlice.actions
export default fxRatesSlice.reducer
