import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import { enhancedApi } from '@/api/api.gen'

const ENVIRONMENT = import.meta.env.VITE_ENV

export const store = configureStore({
  reducer: {
    // Add the generated API reducer
    [enhancedApi.reducerPath]: enhancedApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [enhancedApi.util.getRunningQueriesThunk.type],
        ignoredPaths: [enhancedApi.reducerPath],
      },
    }).concat(enhancedApi.middleware),
  devTools: ENVIRONMENT !== 'production',
})

setupListeners(store.dispatch)

export type IRootState = ReturnType<typeof store.getState>
export type IAppDispatch = typeof store.dispatch
