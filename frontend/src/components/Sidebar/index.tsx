import { useLayout } from '@contexts/LayoutContext'
import type React from 'react'

import { SidebarItem } from './SidebarItem'

const Sidebar: React.FC = () => {
  const { sidebarOpen, stickySidebar, stickyNavbar } = useLayout()
  if (!sidebarOpen) return null

  const navbarHeight = stickyNavbar && stickySidebar ? 'top-[60px]' : 'top-0'

  let desktopSidebarClasses = ''
  if (stickySidebar) {
    const heightClass = stickyNavbar ? 'h-[calc(100vh-60px)]' : 'h-screen'
    desktopSidebarClasses = `sticky ${navbarHeight} ${heightClass} overflow-y-auto`
  } else {
    desktopSidebarClasses = 'h-[calc(100vh-60px)]'
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block max-w-[30vw] p-4 bg-white dark:bg-blue-950 ${desktopSidebarClasses}`}
      >
        <h5 className='whitespace-nowrap'>Sidebar content</h5>
        <div className='flex flex-col gap-4 py-4'>
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

      {/* Mobile Bottom Bar */}
      <div className='md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-blue-950 border-t z-10'>
        <div className='flex justify-around items-center py-2 px-4'>
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
    </>
  )
}

export { Sidebar }
