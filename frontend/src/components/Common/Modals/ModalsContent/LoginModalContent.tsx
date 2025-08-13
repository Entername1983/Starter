import { LoginInternalButton } from '@components/Common/Button/LoginInternalButton'
import { LoginWithGoogleButton } from '@components/Common/Button/LoginWithGoogleButton'
import type React from 'react'

interface LoginModalContentProps {}

const LoginModalContent: React.FC<LoginModalContentProps> = ({}) => {
  return (
    <div>
      <LoginWithGoogleButton />
      <LoginInternalButton />
    </div>
  )
}

export { LoginModalContent }
