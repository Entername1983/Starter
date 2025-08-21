import { Link } from '@tanstack/react-router'

interface NavbarLinkProps {
  linkTo: string
  title: string
}

const NavbarLink = ({ linkTo, title }: NavbarLinkProps) => {
  return (
    <Link to={linkTo} className='[&.active]:font-bold px-2'>
      {title}
    </Link>
  )
}

export { NavbarLink }
