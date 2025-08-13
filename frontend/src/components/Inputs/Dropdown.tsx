import type React from 'react'
import type { ChangeHandler, FieldError, RefCallBack } from 'react-hook-form'

import { DropdownOption } from './DropdownOption'

interface IDropdownOption {
  value: string
  label: string
  disabled?: boolean
  selected?: boolean
  className?: string
  onSelect?: () => void
}

interface IDropdownProps {
  label?: string
  onChange: ChangeHandler
  onBlur: ChangeHandler
  ref: RefCallBack
  name: string
  required?: boolean
  disabled?: boolean
  multiple?: boolean
  options: IDropdownOption[]
  size?: number
  formId?: string
  style?: string
  labelStyle?: string
  selectStyle?: string
  defaultValue: string
  errorStyle?: string
  includeErrorSpace?: boolean
  error?: FieldError | undefined
}

const Dropdown: React.FC<IDropdownProps> = ({
  label,
  onChange,
  onBlur,
  ref,
  name,
  formId,
  options,
  multiple,
  size,
  required = false,
  disabled = false,
  labelStyle,
  selectStyle,
  style,
  defaultValue,
  errorStyle,
  includeErrorSpace,
  error,
}) => {
  const updatedStyle =
    style ?? 'flex justify-between items-center max-w-[250px]'
  const updatedLabelStyle = labelStyle ?? ''
  const updatedSelectStyle = selectStyle ?? 'border-[1px] rounded-md'
  const updatedErrorClassName = errorStyle ?? 'text-red-500 '

  return (
    <div className={updatedStyle}>
      {label && (
        <label htmlFor={name} className={updatedLabelStyle}>
          {label}
        </label>
      )}
      <select
        defaultValue={defaultValue}
        name={name}
        disabled={disabled}
        ref={ref}
        form={formId}
        required={required}
        onBlur={() => onBlur}
        onChange={() => onChange}
        multiple={multiple}
        size={size}
        className={updatedSelectStyle}
      >
        {options.map((value, index) => (
          <DropdownOption key={index} {...value} />
        ))}
      </select>
      {includeErrorSpace && (
        <div className='h-10 '>
          {error && <p className={updatedErrorClassName}>{error.message}</p>}
        </div>
      )}
    </div>
  )
}

export { Dropdown }
