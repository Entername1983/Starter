import type React from 'react'

interface ContextWrapperProps {
  children: React.ReactNode
}

const ContextWrapper: React.FC<ContextWrapperProps> = ({ children }) => {
  return <>{children}</>
}

export { ContextWrapper }
