import type { SerializedError } from '@reduxjs/toolkit'

interface FastAPIError {
  status: number
  data: {
    detail: string
  }
}

export const isFastAPIError = (error: unknown): error is FastAPIError => {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'data' in error &&
    typeof error.data === 'object' &&
    error.data !== null &&
    'detail' in error.data
  )
}

export const isSerializedError = (error: unknown): error is SerializedError => {
  return typeof error === 'object' && error !== null && 'message' in error
}
