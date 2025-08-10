import useLoginModal from '@hooks/useLoginModal'
import { Link } from '@tanstack/react-router'

const Navbar = () => {
  const { openLoginModal } = useLoginModal()
  return (
    <>
      <Link to='/' className='[&.active]:font-bold'>
        Home
      </Link>
      <Link to='/about' className='[&.active]:font-bold'>
        About
      </Link>
      <button onClick={openLoginModal}>Login</button>
    </>
  )
}

export { Navbar }
