import type React from 'react'

interface IDropdownOptionProps {
  disabled?: boolean
  label: string
  selected?: boolean
  value: string
}

const DropdownOption: React.FC<IDropdownOptionProps> = ({
  disabled = false,
  label,
  value,
}) => {
  return (
    <option disabled={disabled} value={value}>
      {label}
    </option>
  )
}

export { DropdownOption }
