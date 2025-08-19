import StarterLogo from '@assets/starter-logo.svg?react'
import Button from '@components/Common/Button'
import { SettingsMenu } from '@components/Common/SettingsMenu'
import { useLayout } from '@contexts/LayoutContext'
import useLoginModal from '@hooks/useLoginModal'
import { useSettings } from '@hooks/useSettings'
import useUser from '@hooks/useUser'
import { GiHamburgerMenu } from 'react-icons/gi'
import { IoMdClose } from 'react-icons/io'

import { NavbarLink } from './NavbarLink'
import { ThemeToggle } from './ThemeToggle'

const Navbar = () => {
  const { openLoginModal } = useLoginModal()
  const { user, onLogout } = useUser()
  const { stickyNavbar, mobileMenuOpen, toggleMobileMenu } = useLayout()
  const {
    sidebarOpen,
    stickyNavbar: stickyNavbarSetting,
    stickySidebar,
    toggleStickyNavbar,
    toggleStickySidebar,
    handleToggleSidebar,
    handleWelcomeNotification,
  } = useSettings()

  //TODO: remove this if unecessary
  // const [isDarkMode, setIsDarkMode] = useState(() =>
  //   document.body.classList.contains('dark')
  // )
  // useEffect(() => {
  //   const observer = new MutationObserver(mutations => {
  //     mutations.forEach(mutation => {
  //       if (mutation.attributeName === 'class') {
  //         const isDark = document.body.classList.contains('dark')
  //         setIsDarkMode(isDark)
  //       }
  //     })
  //   })

  //   observer.observe(document.body, {
  //     attributes: true,
  //   })

  //   return () => {
  //     observer.disconnect()
  //   }
  // }, [])

  return (
    <nav
      className={`flex justify-between p-2 bg-white dark:bg-blue-950 ${stickyNavbar ? 'sticky top-0 z-10' : ''} relative`}
    >
      {/* Desktop Navigation */}
      <div className='hidden md:flex items-center'>
        <StarterLogo className='h-6 w-6 ' />
        <NavbarLink linkTo='/' title='Home' />
        <NavbarLink linkTo='/about' title='About' />
        <NavbarLink linkTo='/readme' title='ReadMe' />
        <NavbarLink linkTo='/Account' title='Account' />
        <NavbarLink linkTo='/License' title='License' />
        <NavbarLink linkTo='/LoremIpsum' title='Lorem Ipsum' />
      </div>
      <div className='hidden md:flex gap-2 items-center'>
        <ThemeToggle />
        <span className='text-gray-400'>|</span>
        <SettingsMenu />
        <span className='text-gray-400'>|</span>
        {user ? (
          <Button
            onClick={() => {
              void onLogout()
            }}
            className='hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded'
          >
            Logout
          </Button>
        ) : (
          <Button
            onClick={openLoginModal}
            className='hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded'
          >
            Login
          </Button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className='md:hidden flex w-full justify-between items-center'>
        <StarterLogo className='h-6 w-6' />
        <Button
          onClick={toggleMobileMenu}
          className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded'
          aria-label='Toggle menu'
        >
          {mobileMenuOpen ? (
            <IoMdClose className='h-6 w-6' />
          ) : (
            <GiHamburgerMenu className='h-6 w-6' />
          )}
        </Button>
      </div>

      {mobileMenuOpen && (
        <div className='md:hidden absolute top-full left-0 w-full bg-white dark:bg-blue-950 border-t z-20 border-b-2 border-b-amber-400 animate-slide-down'>
          <div className='flex flex-col p-2'>
            <NavbarLink linkTo='/' title='Home' />
            <NavbarLink linkTo='/about' title='About' />
            <NavbarLink linkTo='/readme' title='ReadMe' />
            <NavbarLink linkTo='/Account' title='Account' />
            <NavbarLink linkTo='/License' title='License' />
            <NavbarLink linkTo='/LoremIpsum' title='Lorem Ipsum' />

            <hr className='my-2 border-gray-300 dark:border-gray-600' />

            <div className='py-2'>
              <div className='grid grid-cols-2 gap-2 mb-3'>
                <Button
                  onClick={toggleStickySidebar}
                  className='flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm'
                >
                  <span>Stick Sidebar</span>
                  <span>{stickySidebar ? '✓' : '○'}</span>
                </Button>
                <Button
                  onClick={toggleStickyNavbar}
                  className='flex items-center justify-between p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm'
                >
                  <span>Stick Navbar</span>
                  <span>{stickyNavbarSetting ? '✓' : '○'}</span>
                </Button>
              </div>

              <div className='grid grid-cols-1 gap-2 mb-3'>
                <Button
                  onClick={handleToggleSidebar}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-left'
                >
                  {sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'}
                </Button>
                <Button
                  onClick={handleWelcomeNotification}
                  className='p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-sm text-left'
                >
                  Welcome Notification
                </Button>
              </div>
            </div>

            <hr className='my-2 border-gray-300 dark:border-gray-600' />

            <div className='flex justify-between items-center py-2'>
              <ThemeToggle />
              {user ? (
                <Button
                  onClick={() => {
                    void onLogout()
                  }}
                  className='hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded'
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={openLoginModal}
                  className='hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded'
                >
                  Login
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export { Navbar }
