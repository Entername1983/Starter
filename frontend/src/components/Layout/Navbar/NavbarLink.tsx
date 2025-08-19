import { Link } from '@tanstack/react-router'
import type React from 'react'

interface NavbarLinkProps {
  linkTo: string
  title: string
}

const NavbarLink: React.FC<NavbarLinkProps> = ({ linkTo, title }) => {
  return (
    <Link to={linkTo} className='[&.active]:font-bold px-2'>
      {title}
    </Link>
  )
}

export { NavbarLink }
