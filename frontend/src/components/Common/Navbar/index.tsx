import useLoginModal from '@hooks/useLoginModal'
import type { INotificationOptions } from '@hooks/useNotificationModal'
import useNotificationModal from '@hooks/useNotificationModal'
import useUser from '@hooks/useUser'

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
    <>
      <NavbarLink linkTo='/' title='Home' />
      <NavbarLink linkTo='/about' title='About' />
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
    </>
  )
}

export { Navbar }
