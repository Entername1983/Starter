import { Link } from '@tanstack/react-router'

import { LoginButton } from '../Button/LoginButton'

const Navbar = () => {
  return (
    <>
      <Link to='/' className='[&.active]:font-bold'>
        Home
      </Link>{' '}
      <Link to='/about' className='[&.active]:font-bold'>
        About
      </Link>
      <LoginButton />
    </>
  )
}

export { Navbar }
