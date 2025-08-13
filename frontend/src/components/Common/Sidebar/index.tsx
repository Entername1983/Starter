import type React from 'react'

import { SidebarItem } from './SidebarItem'

import { useLayout } from '@/contexts/LayoutContext'

const Sidebar: React.FC = () => {
  const { sidebarOpen, stickySidebar, stickyNavbar } = useLayout()
  if (!sidebarOpen) return null

  const navbarHeight = stickyNavbar && stickySidebar ? 'top-[60px]' : 'top-0'

  let sidebarClasses = ''
  if (stickySidebar) {
    const heightClass = stickyNavbar ? 'h-[calc(100vh-60px)]' : 'h-screen'
    sidebarClasses = `sticky ${navbarHeight} ${heightClass} overflow-y-auto`
  } else {
    sidebarClasses = 'h-[calc(100vh-60px)]'
  }

  return (
    <div
      className={`max-w-[30vw] p-4 bg-white dark:bg-blue-950 ${sidebarClasses}`}
    >
      <h5 className='whitespace-nowrap'>Sidebar content</h5>
      <div className='flex flex-col gap-4 py-4 '>
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
