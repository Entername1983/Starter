import { useLayout } from '@contexts/LayoutContext'
import useNotificationModal from '@hooks/useNotificationModal'
import type { INotificationOptions } from '@hooks/useNotificationModal'

export const useSettings = () => {
  const {
    sidebarOpen,
    setSidebarOpen,
    stickyNavbar,
    toggleStickyNavbar,
    stickySidebar,
    toggleStickySidebar,
  } = useLayout()

  const { setAndOpenNotificationsModal } = useNotificationModal()

  const welcomeNotificationModal: INotificationOptions = {
    type: 'success',
    title: 'welcome',
    message: 'welcome to my website',
    closedby: 'any',
  }

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleWelcomeNotification = () => {
    setAndOpenNotificationsModal(welcomeNotificationModal)
  }

  return {
    // States
    sidebarOpen,
    stickyNavbar,
    stickySidebar,
    
    // Actions
    toggleStickyNavbar,
    toggleStickySidebar,
    handleToggleSidebar,
    handleWelcomeNotification,
  }
}