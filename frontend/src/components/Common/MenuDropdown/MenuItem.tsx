import type React from 'react'

import type { MenuItem } from './types'

interface MenuItemProps {
  item: MenuItem
  onItemClick: () => void
}

const MenuItemComponent: React.FC<MenuItemProps> = ({ item, onItemClick }) => {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (item.type === 'button') {
      item.onClick(event)
    } else if (item.type === 'toggle') {
      item.onToggle(event)
    }
    onItemClick()
  }

  if (item.type === 'divider') {
    return <hr className="border-gray-300 dark:border-gray-600" />
  }

  const baseClasses = "w-full text-left p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
  
  if (item.type === 'toggle') {
    return (
      <button
        className={baseClasses}
        onClick={handleClick}
        disabled={item.disabled}
      >
        <span className="flex justify-between">
          <span>{item.label}</span>
          <span>{item.isToggled ? '✓' : '○'}</span>
        </span>
      </button>
    )
  }

  return (
    <button
      className={baseClasses}
      onClick={handleClick}
      disabled={item.disabled}
    >
      {item.label}
    </button>
  )
}

export { MenuItemComponent }