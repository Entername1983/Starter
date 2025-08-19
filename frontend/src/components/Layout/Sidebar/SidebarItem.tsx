import type React from 'react'

interface ISidebarItemProps {
  label: string
  onClick: () => void
}

const SidebarItem: React.FC<ISidebarItemProps> = ({ label, onClick }) => {
  return (
    <div>
      <button onClick={onClick}>{label}</button>
    </div>
  )
}

export { SidebarItem }
