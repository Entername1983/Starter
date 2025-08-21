import { useSettings } from '@hooks/useSettings'
import { MdOutlineSettings } from 'react-icons/md'

import Button from './Button'
import { MenuDropdown } from './MenuDropdown'
import type { MenuItem } from './MenuDropdown/types'

const SettingsMenu = () => {
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
      type: 'toggle',
      label: sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar',
      isToggled: sidebarOpen,
      onToggle: handleToggleSidebar,
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
    <Button className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded flex items-center gap-2'>
      <span>
        <MdOutlineSettings />
      </span>
      Settings!
    </Button>
  )

  return <MenuDropdown trigger={trigger} items={menuItems} position='right' />
}

export { SettingsMenu }
