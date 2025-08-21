import type { ChangeHandler, FieldError, RefCallBack } from 'react-hook-form'

export type InputType =
  | 'button'
  | 'checkbox'
  | 'color'
  | 'date'
  | 'datetime-local'
  | 'email'
  | 'file'
  | 'hidden'
  | 'month'
  | 'number'
  | 'time'
  | 'text'
  | 'tel'
  | 'submit'
  | 'week'
  | 'password'
  | 'search'
  | 'range'
  | 'reset'
  | 'radio'

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
  id?: string
  style?: string
  error?: FieldError | undefined
  errorStyle?: string
  inputStyle?: string
  includeErrorSpace?: boolean
  labelStyle?: string
  type?: InputType
}

export const InputField = ({
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
  id,
  inputStyle,
  errorStyle,
  error,
  includeErrorSpace,
  labelStyle,
  style,
  type = 'text',
}: IInputField) => {
  const updatedLabelStyle = labelStyle ?? ''
  const updatedStyle = style ?? ''
  const updatedInputClassName =
    inputStyle ?? 'px-2 py-1 border-[1px] rounded-lg'
  const updatedErrorClassName = errorStyle ?? 'text-red-500 '

  //TODO: Improve location of error messages
  return (
    <div className={updatedStyle}>
      {label && (
        <label className={updatedLabelStyle} htmlFor={name}>
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        ref={ref}
        name={name}
        placeholder={placeholder}
        required={required}
        onChange={e => {
          void onChange(e)
        }}
        onBlur={e => {
          void onBlur(e)
        }}
        pattern={pattern}
        disabled={disabled}
        min={min}
        max={max}
        maxLength={maxLength}
        minLength={minLength}
        className={` ${updatedInputClassName} relative`}
      />
      {includeErrorSpace && (
        <div className=' '>
          {error && (
            <p className={`${updatedErrorClassName} h-10 absolute top-20 `}>
              {error.message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
