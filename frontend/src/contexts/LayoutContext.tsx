import { createContext, useContext, useState, type ReactNode } from 'react'

interface LayoutContextType {
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  toggleSidebar: () => void
  sidebarContent: ReactNode | null
  setSidebarContent: (content: ReactNode | null) => void
  stickyNavbar: boolean
  setStickyNavbar: (sticky: boolean) => void
  toggleStickyNavbar: () => void
  stickySidebar: boolean
  setStickySidebar: (sticky: boolean) => void
  toggleStickySidebar: () => void
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
  const [stickyNavbar, setStickyNavbar] = useState(false)
  const [stickySidebar, setStickySidebar] = useState(false)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const toggleStickyNavbar = () => {
    setStickyNavbar(!stickyNavbar)
  }

  const toggleStickySidebar = () => {
    setStickySidebar(!stickySidebar)
  }

  return (
    <LayoutContext.Provider
      value={{
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        sidebarContent,
        setSidebarContent,
        stickyNavbar,
        setStickyNavbar,
        toggleStickyNavbar,
        stickySidebar,
        setStickySidebar,
        toggleStickySidebar,
      }}
    >
      {children}
    </LayoutContext.Provider>
  )
}
