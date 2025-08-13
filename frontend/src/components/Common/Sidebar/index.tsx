import type React from 'react'

import { SidebarItem } from './SidebarItem'

import { useLayout } from '@/contexts/LayoutContext'

const Sidebar: React.FC = () => {
  const { sidebarOpen } = useLayout()
  if (!sidebarOpen) return null

  return (
    <div className='max-w-[30vw]  h-screen p-4'>
      <h5 className='whitespace-nowrap'>Sidebar content</h5>
      <div className='flex flex-col gap-4 py-4 h-full'>
        <SidebarItem
          label='Item-1'
          onClick={() => {
            console.log('item 1 clicked')
          }}
        />
        <SidebarItem
          label='Item-2'
          onClick={() => {
            console.log('item 2 clicked')
          }}
        />
        <SidebarItem
          label='Item-3'
          onClick={() => {
            console.log('item 3 clicked')
          }}
        />
      </div>
    </div>
  )
}

export { Sidebar }
