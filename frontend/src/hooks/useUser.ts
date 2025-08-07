import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import type { IRootState } from '@store/store'
import { setUser } from '@store/user/userSlice'
import { useEffect } from 'react'

import { useCheckUserStatusQuery, type UserSchema } from '../api/api.gen'

interface IUseAuth {
  user?: UserSchema | null
  isLoading: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
}

const useUser = (): IUseAuth => {
  const { data, error, isLoading } = useCheckUserStatusQuery()
  const user = useAppSelector((state: IRootState) => state.user.user)
  const dispatch = useAppDispatch()
  useEffect(() => {
    if (data) {
      dispatch(setUser(data.user))
    }
  }, [data, dispatch])

  return {
    user,
    isLoading,
    error,
  }
}

export default useUser
