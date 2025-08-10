import { LoginButton } from '@components/Common/Button/LoginButton'
import type React from 'react'

interface LoginModalContentProps {}

const LoginModalContent: React.FC<LoginModalContentProps> = ({}) => {
  return (
    <div>
      <LoginButton />
    </div>
  )
}

export { LoginModalContent }
