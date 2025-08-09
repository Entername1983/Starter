import useUser from '@hooks/useUser'
import type React from 'react'
const LoginButton: React.FC = () => {
  const { user, onLogout, isLoggingOutLoading, handleGoogleSignIn, isLoading } =
    useUser()

  return (
    <>
      {user ? (
        <button
          onClick={() => {
            void onLogout()
          }}
          disabled={isLoggingOutLoading}
          type='button'
        >
          Logout
        </button>
      ) : (
        <button onClick={handleGoogleSignIn} type='button' disabled={isLoading}>
          Login
        </button>
      )}
    </>
  )
}

export { LoginButton }
