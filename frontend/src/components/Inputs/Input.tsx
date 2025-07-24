import type { ChangeHandler, RefCallBack } from 'react-hook-form'

interface IInputField {
  label?: string
  placeholder?: string
  onChange: ChangeHandler
  onBlur: ChangeHandler
  ref: RefCallBack
  name: string
  min?: string | number
  max?: string | number
  maxLength?: number
  minLength?: number
  pattern?: string
  required?: boolean
  disabled?: boolean
}

export const InputField: React.FC<IInputField> = ({
  label,
  placeholder,
  onChange,
  onBlur,
  ref,
  name,
  min,
  max,
  maxLength,
  minLength,
  pattern,
  required,
  disabled,
}) => {
  return (
    <div className=''>
      {label && <label htmlFor={name}>{label}</label>}
      <input
        className='border-[1px] rounded-md'
        ref={ref}
        name={name}
        placeholder={placeholder}
        required={required}
        // value={name}
        onChange={() => onChange}
        onBlur={() => onBlur}
        pattern={pattern}
        disabled={disabled}
        min={min}
        max={max}
        maxLength={maxLength}
        minLength={minLength}
      />
    </div>
  )
}
