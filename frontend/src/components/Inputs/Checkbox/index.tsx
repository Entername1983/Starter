import type { ChangeHandler, FieldError, RefCallBack } from 'react-hook-form'

interface ICheckboxProps {
  label?: string
  placeholder?: string
  onChange: ChangeHandler
  onBlur: ChangeHandler
  ref: RefCallBack
  name: string
  required?: boolean
  disabled?: boolean
  id?: string
  style?: string
  labelStyle?: string
  inputStyle?: string
  errorStyle?: string
  includeErrorSpace?: boolean
  error?: FieldError | undefined
}

const Checkbox = ({
  label,
  placeholder,
  onChange,
  onBlur,
  ref,
  name,
  required,
  disabled,
  id,
  style,
  errorStyle,
  labelStyle,
  inputStyle,
  includeErrorSpace,
  error,
}: ICheckboxProps) => {
  const updatedClassName =
    style ?? 'flex justify-between items-center max-w-[250px]'
  const updatedLabelStyle = labelStyle ?? ''
  const updatedInputStyle = inputStyle ?? 'border-[1px] rounded-md'
  const updatedErrorClassName = errorStyle ?? 'text-red-500 '

  return (
    <div className={updatedClassName}>
      {label && (
        <label className={updatedLabelStyle} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        id={id}
        type='checkbox'
        className={updatedInputStyle}
        ref={ref}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={() => onChange}
        onBlur={() => onBlur}
        disabled={disabled}
      />
      {includeErrorSpace && (
        <div className='h-10 bg-white'>
          {error && <p className={updatedErrorClassName}>{error.message}</p>}
        </div>
      )}
    </div>
  )
}

export { Checkbox }
