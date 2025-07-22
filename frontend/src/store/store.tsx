import injectedRtkApi from '@api/api'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

const ENVIRONMENT = import.meta.env.VITE_ENV

// 1. Pull out the reducerPath and reducer from your generated API
const {
  reducerPath,
  reducer: apiReducer,
  middleware: apiMiddleware,
} = injectedRtkApi
export const store = configureStore({
  reducer: {},
  devTools: ENVIRONMENT !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
  // .concat(logger)
  // .concat(toastMiddleware)
  // .concat(api.middleware),
})

setupListeners(store.dispatch)
