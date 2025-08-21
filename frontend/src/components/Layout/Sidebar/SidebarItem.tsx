interface ISidebarItemProps {
  label: string
  onClick: () => void
}

const SidebarItem = ({ label, onClick }: ISidebarItemProps) => {
  return (
    <div>
      <button onClick={onClick}>{label}</button>
    </div>
  )
}

export { SidebarItem }
