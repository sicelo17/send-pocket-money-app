import { configureStore } from "@reduxjs/toolkit"
import authSlice from "./slices/authSlice"
import fxRatesSlice from "./slices/fxRatesSlice"
import transactionsSlice from "./slices/transactionsSlice"

export const store = configureStore({
  reducer: {
    auth: authSlice,
    fxRates: fxRatesSlice,
    transactions: transactionsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST"],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
