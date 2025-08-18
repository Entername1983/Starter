import type React from 'react'
import { useEffect, useRef, useState } from 'react'

import { MenuItemComponent } from './MenuItem'
import type { MenuDropdownProps } from './types'

const MenuDropdown: React.FC<MenuDropdownProps> = ({
  trigger,
  items,
  position = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  const closeMenu = () => {
    setIsOpen(false)
  }

  const positionClasses = position === 'left' ? 'left-0' : 'right-0'

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div
        onClick={toggleMenu}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleMenu()
          }
        }}
        tabIndex={0}
        role='button'
        aria-expanded={isOpen}
        aria-haspopup='true'
        className='cursor-pointer'
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${positionClasses} top-full mt-1 bg-white dark:bg-gray-800 border rounded shadow-lg z-10 min-w-48 animate-slide-down`}
        >
          {items.map(item => (
            <MenuItemComponent
              key={item.id}
              item={item}
              onItemClick={closeMenu}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export { MenuDropdown }
