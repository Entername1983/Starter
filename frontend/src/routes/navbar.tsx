import { useLogoutUserMutation } from '@api/api.gen'
import { useAppDispatch } from '@store/hooks'
import { removeUser } from '@store/user/userSlice'
import { Link } from '@tanstack/react-router'

const Navbar = () => {
  const [logoutUser, { isLoading, isSuccess, isError, error }] =
    useLogoutUserMutation()
  const dispatch = useAppDispatch()
  return (
    <>
      <Link to='/' className='[&.active]:font-bold'>
        Home
      </Link>{' '}
      <Link to='/about' className='[&.active]:font-bold'>
        About
      </Link>
      <button
        onClick={() => {
          const handleLogout = async () => {
            await logoutUser().unwrap()
            dispatch(removeUser())
          }
          void handleLogout()
        }}
        disabled={isLoading}
      >
        Logout
      </button>
    </>
  )
}

export { Navbar }
