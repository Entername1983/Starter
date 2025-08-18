import type { ReactNode, MouseEventHandler } from 'react'

export type MenuItemType = 'button' | 'toggle' | 'divider'

interface BaseMenuItem {
  id: string
  type: MenuItemType
}

export interface ButtonMenuItem extends BaseMenuItem {
  type: 'button'
  label: string
  onClick: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export interface ToggleMenuItem extends BaseMenuItem {
  type: 'toggle'
  label: string
  isToggled: boolean
  onToggle: MouseEventHandler<HTMLButtonElement>
  disabled?: boolean
}

export interface DividerMenuItem extends BaseMenuItem {
  type: 'divider'
}

export type MenuItem = ButtonMenuItem | ToggleMenuItem | DividerMenuItem

export interface MenuDropdownProps {
  trigger: ReactNode
  items: MenuItem[]
  position?: 'left' | 'right'
  className?: string
}