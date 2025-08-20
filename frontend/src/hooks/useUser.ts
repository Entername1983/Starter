import {
  useConfirmEmailMutation,
  useLogoutUserMutation,
  useSignInMutation,
} from '@api/api.gen'
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
  onLogout: () => Promise<void>
  isLoggingOutLoading: boolean
  signIn: ReturnType<typeof useSignInMutation>[0]
  signInError: FetchBaseQueryError | SerializedError | undefined
  confirmEmail: ReturnType<typeof useConfirmEmailMutation>[0]
  confirmEmailIsLoading: boolean
  confirmEmailError: FetchBaseQueryError | SerializedError | undefined
}

const useUser = (): IUseAuth => {
  const user = useAppSelector((state: IRootState) => state.user.user)
  const dispatch = useAppDispatch()
  const location = useLocation()
  const [signIn, { error: signInError }] = useSignInMutation()

  const [logoutUser, { isLoading: isLoggingOutLoading }] =
    useLogoutUserMutation()

  const [
    confirmEmail,
    { isLoading: confirmEmailIsLoading, error: confirmEmailError },
  ] = useConfirmEmailMutation()

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

    const fullUrl = `${import.meta.env.VITE_API_URL}/user/auth/google_sign_in?originalPage=${redirectBack}`

    console.log('VITE_API_URL:', import.meta.env.VITE_API_URL)
    console.log('Full URL:', fullUrl)

    window.location.href = fullUrl
  }

  const onLogout = async () => {
    try {
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
    signIn,
    signInError,
    confirmEmail,
    confirmEmailError,
    confirmEmailIsLoading,
  }
}

export default useUser
