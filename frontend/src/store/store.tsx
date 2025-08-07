import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import userReducer from '@store/user/userSlice'

import { enhancedApi } from '@/api/api.gen'

const ENVIRONMENT = import.meta.env.VITE_ENV

export const store = configureStore({
  reducer: {
    user: userReducer,

    [enhancedApi.reducerPath]: enhancedApi.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: [enhancedApi.reducerPath],
      },
    }).concat(enhancedApi.middleware),
  devTools: ENVIRONMENT !== 'production',
})

setupListeners(store.dispatch)

export type IRootState = ReturnType<typeof store.getState>
export type IAppDispatch = typeof store.dispatch
