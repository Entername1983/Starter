import StarterLogo from '@assets/starter-logo.svg?react'
import useLoginModal from '@hooks/useLoginModal'
import type { INotificationOptions } from '@hooks/useNotificationModal'
import useNotificationModal from '@hooks/useNotificationModal'
import useUser from '@hooks/useUser'
import { Button } from '@mantine/core'

import { NavbarLink } from './NavbarLink'

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

  return (
    <nav className='flex justify-between p-2 '>
      <div className='flex items-center'>
        <StarterLogo className='h-6 w-6 ' />
        <NavbarLink linkTo='/' title='Home' />
        <NavbarLink linkTo='/about' title='About' />
        <NavbarLink linkTo='/readme' title='ReadMe' />
        <NavbarLink linkTo='/about' title='About' />
        <NavbarLink linkTo='/about' title='About' />
        <NavbarLink linkTo='/about' title='About' />
      </div>
      <div className='flex gap-2'>
        {user ? (
          <Button
            onClick={() => {
              void onLogout()
            }}
          >
            Logout
          </Button>
        ) : (
          <Button onClick={openLoginModal}>Login</Button>
        )}
        <Button
          onClick={() => {
            setAndOpenNotificationsModal(welcomeNotificationModal)
          }}
        >
          Welcome notifications modal
        </Button>
      </div>
    </nav>
  )
}

export { Navbar }
