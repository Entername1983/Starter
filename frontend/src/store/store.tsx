import { configureStore } from '@reduxjs/toolkit'

const ENVIRONMENT = import.meta.env.VITE_ENV

export const store = configureStore({
  reducer: {},
  devTools: ENVIRONMENT !== 'production',
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({ serializableCheck: false }),
  // .concat(logger)
  // .concat(toastMiddleware)
  // .concat(api.middleware),
})
