import { useSettings } from '@hooks/useSettings'
import type React from 'react'
import { MdOutlineSettings } from 'react-icons/md'

import { MenuDropdown } from './MenuDropdown'
import type { MenuItem } from './MenuDropdown/types'

const SettingsMenu: React.FC = () => {
  const {
    sidebarOpen,
    stickyNavbar,
    stickySidebar,
    toggleStickyNavbar,
    toggleStickySidebar,
    handleToggleSidebar,
    handleWelcomeNotification,
  } = useSettings()

  const menuItems: MenuItem[] = [
    {
      id: 'sticky-sidebar',
      type: 'toggle',
      label: 'Stick Sidebar',
      isToggled: stickySidebar,
      onToggle: toggleStickySidebar,
    },
    {
      id: 'sticky-navbar',
      type: 'toggle',
      label: 'Stick Navbar',
      isToggled: stickyNavbar,
      onToggle: toggleStickyNavbar,
    },
    {
      id: 'divider-1',
      type: 'divider',
    },
    {
      id: 'toggle-sidebar',
      type: 'button',
      label: sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar',
      onClick: handleToggleSidebar,
    },
    {
      id: 'divider-2',
      type: 'divider',
    },
    {
      id: 'welcome-modal',
      type: 'button',
      label: 'Welcome Notification',
      onClick: handleWelcomeNotification,
    },
  ]

  const trigger = (
    <button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2'>
      <span>
        <MdOutlineSettings />
      </span>
      Settings
    </button>
  )

  return <MenuDropdown trigger={trigger} items={menuItems} position='right' />
}

export { SettingsMenu }
