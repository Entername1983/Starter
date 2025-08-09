import type React from 'react'

import { useLayout } from '@/contexts/LayoutContext'

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, sidebarContent } = useLayout()
  if (!sidebarOpen) return null

  return (
    <div className='max-w-[20vw] bg-red-200 h-[100vh]'> Sidebar content </div>
  )
}

export { Sidebar }
