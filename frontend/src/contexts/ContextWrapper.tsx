import type React from 'react'

import { LayoutProvider } from './LayoutContext'
import { ModalContextProvider } from './ModalContext'
interface ContextWrapperProps {
  children: React.ReactNode
}

const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  return (
    <LayoutProvider>
      <ModalContextProvider>{children}</ModalContextProvider>
    </LayoutProvider>
  )
}

export { ContextWrapper }
