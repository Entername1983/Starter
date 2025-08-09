import { createContext, useContext, useState, type ReactNode } from 'react'

interface LayoutContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  sidebarContent: ReactNode | null
  setSidebarContent: (content: ReactNode | null) => void
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useLayout = () => {
  const context = useContext(LayoutContext)
  if (!context) {
    throw new Error('useLayout must be used within a LayoutProvider')
  }
  return context
}

interface LayoutProviderProps {
  children: ReactNode
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [sidebarContent, setSidebarContent] = useState<ReactNode | null>(null)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        sidebarContent,
        setSidebarContent,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
