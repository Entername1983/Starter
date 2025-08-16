import { LoginWithGoogleButton } from '@components/Common/Button/LoginWithGoogleButton'
import type React from 'react'

import { LoginForm } from './LoginForm'

interface LoginModalContentProps {}

const LoginModalContent: React.FC<LoginModalContentProps> = ({}) => {
  return (
    <div>
      <LoginForm />

      <LoginWithGoogleButton />
    </div>
  )
}

export { LoginModalContent }
