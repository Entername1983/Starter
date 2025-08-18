import useUser from '@hooks/useUser'
import type React from 'react'

const LoginInternalButton: React.FC = () => {
  const { user, onLogout, isLoggingOutLoading } = useUser()

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
        <div className='space-y-4 '>
          {/* <Button
            variant='primary'
            fullWidth
            onClick={handleInternalSignIn}
            type='button'
            disabled={isLoading}
            leftIcon={<HiLogin />}
          >
            Login / Register
          </Button> */}
        </div>
      )}
    </>
  )
}

export { LoginInternalButton }
