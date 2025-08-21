interface IDropdownOptionProps {
  disabled?: boolean
  label: string
  selected?: boolean
  value: string
}

const DropdownOption = ({
  disabled = false,
  label,
  value,
}: IDropdownOptionProps) => {
  return (
    <option
      disabled={disabled}
      className='dark:bg-blue-500 dark:text-white'
      value={value}
    >
      {label}
    </option>
  )
}

export { DropdownOption }
