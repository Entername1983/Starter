import type React from 'react'

import { LayoutProvider } from './LayoutContext'
interface ContextWrapperProps {
  children: React.ReactNode
}

const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  return <LayoutProvider>{children}</LayoutProvider>
}

export { ContextWrapper }
