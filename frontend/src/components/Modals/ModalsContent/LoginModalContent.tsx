import { LoginWithGoogleButton } from '@components/Common/Button/LoginWithGoogleButton'
import type React from 'react'

import { LoginForm } from './LoginForm'

interface LoginModalContentProps {}

const LoginModalContent: React.FC<LoginModalContentProps> = ({}) => {
  return (
    <div className='space-y-3'>
      <LoginForm />
      
      <div className='border-t pt-3'>
        <div className='text-center text-xs text-gray-600 dark:text-gray-400 mb-2'>
          Or continue with
        </div>
        <LoginWithGoogleButton />
      </div>
    </div>
  )
}

export { LoginModalContent }
