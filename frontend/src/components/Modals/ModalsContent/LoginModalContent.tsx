import { LoginWithGoogleButton } from '@components/Common/Button/LoginWithGoogleButton'

import { LoginForm } from './LoginForm'

const LoginModalContent = () => {
  return (
    <div className='space-y-3'>
      <LoginForm />

      <div className='border-t pt-3 '>
        <div className='text-center text-xs text-gray-600 dark:text-gray-400 mb-2'>
          Or continue with
        </div>
        <div className='flex justify-center'>
          <LoginWithGoogleButton />
        </div>
      </div>
    </div>
  )
}

export { LoginModalContent }
