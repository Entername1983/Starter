import StarterLogo from '@assets/starter-logo.svg?react'
import { useLayout } from '@contexts/LayoutContext'
import useLoginModal from '@hooks/useLoginModal'
import type { INotificationOptions } from '@hooks/useNotificationModal'
import useNotificationModal from '@hooks/useNotificationModal'
import useUser from '@hooks/useUser'
import { useEffect, useState } from 'react'

import { NavbarLink } from './NavbarLink'
import { ThemeToggle } from './ThemeToggle'

const Navbar = () => {
  const { openLoginModal } = useLoginModal()
  const { user, onLogout } = useUser()
  const { setAndOpenNotificationsModal } = useNotificationModal()
  const welcomeNotificationModal: INotificationOptions = {
    type: 'success',
    title: 'welcome',
    message: 'welcome to my website',
    closedby: 'any',
  }
  const { sidebarOpen, setSidebarOpen } = useLayout()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark')
  )
  useEffect(() => {
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.attributeName === 'class') {
          const isDark = document.body.classList.contains('dark')
          setIsDarkMode(isDark)
        }
      })
    })

    observer.observe(document.body, {
      attributes: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <nav className='flex justify-between p-2 '>
      <div className='flex items-center'>
        <StarterLogo className='h-6 w-6 ' />
        <NavbarLink linkTo='/' title='Home' />
        <NavbarLink linkTo='/about' title='About' />
        <NavbarLink linkTo='/readme' title='ReadMe' />
        <NavbarLink linkTo='/Account' title='Account' />
        <NavbarLink linkTo='/License' title='License' />
        <NavbarLink linkTo='/about' title='About' />
      </div>
      <div className='flex gap-2'>
        <ThemeToggle />
        <button
          onClick={() => {
            setSidebarOpen(!sidebarOpen)
          }}
        >
          Toggle side bar
        </button>
        {user ? (
          <button
            onClick={() => {
              void onLogout()
            }}
          >
            Logout
          </button>
        ) : (
          <button onClick={openLoginModal}>Login</button>
        )}
        <button
          onClick={() => {
            setAndOpenNotificationsModal(welcomeNotificationModal)
          }}
        >
          Welcome notifications modal
        </button>
      </div>
    </nav>
  )
}

export { Navbar }
