import { useLogoutUserMutation } from '@api/api.gen'
import useUser from '@hooks/useUser'
import { useAppDispatch } from '@store/hooks'
import { removeUser } from '@store/user/userSlice'
import { useLocation } from '@tanstack/react-router'
import type React from 'react'

interface LoginBtnProps {}

const LoginButton: React.FC<LoginBtnProps> = ({}) => {
  const [logoutUser, { isLoading }] = useLogoutUserMutation()
  const dispatch = useAppDispatch()
  const { user } = useUser()
  const location = useLocation()

  const handleGoogleSignIn = () => {
    const redirectBack = encodeURIComponent(location.pathname)

    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/user/auth/google_sign_in?originalPage=${redirectBack}`
  }

  return (
    <>
      {user ? (
        <button
          onClick={() => {
            const handleLogout = async () => {
              await logoutUser().unwrap()
              dispatch(removeUser())
            }
            void handleLogout()
          }}
          disabled={isLoading}
        >
          Logout
        </button>
      ) : (
        <button onClick={handleGoogleSignIn} type='button'>
          Login
        </button>
      )}
    </>
  )
}

export { LoginButton }
