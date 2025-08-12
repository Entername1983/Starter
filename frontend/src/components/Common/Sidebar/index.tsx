import type React from 'react'

import { SidebarItem } from './SidebarItem'

import { useLayout } from '@/contexts/LayoutContext'

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen, sidebarContent } = useLayout()
  if (!sidebarOpen) return null

  return (
    <div className='max-w-[30vw] bg-blue-500 h-[100vh] sticky p-4'>
      <h3 className='whitespace-nowrap'>Sidebar content</h3>
      <div className='flex flex-col gap-4 py-4 h-full'>
        <SidebarItem label='Item-1' onClick={() => {}} />
        <SidebarItem label='Item-2' onClick={() => {}} />
        <SidebarItem label='Item-3' onClick={() => {}} />
      </div>
    </div>
  )
}

export { Sidebar }
