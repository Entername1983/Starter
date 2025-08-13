import { useLogoutUserMutation } from '@api/api.gen'
import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useAppDispatch, useAppSelector } from '@store/hooks'
import type { IRootState } from '@store/store'
import { setUser } from '@store/user/userSlice'
import { useLocation } from '@tanstack/react-router'
import { useEffect } from 'react'

import { useCheckUserStatusQuery, type UserSchema } from '../api/api.gen'

interface IUseAuth {
  user?: UserSchema | null
  isLoading: boolean
  error?: FetchBaseQueryError | SerializedError | undefined
  handleGoogleSignIn: () => void
  handleInternalSignIn: () => void
  onLogout: () => Promise<void>
  isLoggingOutLoading: boolean
}

const useUser = (): IUseAuth => {
  const user = useAppSelector((state: IRootState) => state.user.user)
  const dispatch = useAppDispatch()
  const location = useLocation()

  const [logoutUser, { isLoading: isLoggingOutLoading }] =
    useLogoutUserMutation()

  const { currentData, error, isLoading } = useCheckUserStatusQuery(undefined, {
    skip: !!user,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (!user && currentData?.user) {
      dispatch(setUser(currentData.user))
    }
  }, [currentData, dispatch, user])

  const handleGoogleSignIn = () => {
    const redirectBack = encodeURIComponent(location.pathname)

    window.location.href = `${import.meta.env.VITE_API_URL}/user/auth/google_sign_in?originalPage=${redirectBack}`
  }

  const handleInternalSignIn = () => {
    console.log('handling internal sign in')
  }

  const onLogout = async () => {
    try {
      console.log('logging out user')
      await logoutUser().unwrap()
    } finally {
      void dispatch(setUser(null))
    }
  }

  return {
    handleGoogleSignIn,
    onLogout,
    user,
    isLoading,
    isLoggingOutLoading,
    error,
    handleInternalSignIn,
  }
}

export default useUser
