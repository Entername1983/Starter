import type { ButtonHTMLAttributes, ReactNode } from 'react'
export interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'dropdown' | 'icon' | 'randomize'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  loading?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  children: ReactNode
}

const Button = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  leftIcon,
  rightIcon,
  children,
  className = '',
  disabled,
  ...props
}: IButtonProps) => {
  const baseClasses = 'flex items-center '

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  console.log('variant', variant)
  const widthClasses = fullWidth ? 'w-full' : ''

  const combinedClasses = [
    baseClasses,
    sizeClasses[size],
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      className={combinedClasses}
      disabled={disabled ?? loading}
      {...props}
    >
      {loading && (
        <svg
          className='animate-spin -ml-1 mr-3 h-5 w-5'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
        >
          <circle
            className='opacity-25'
            cx='12'
            cy='12'
            r='10'
            stroke='currentColor'
            strokeWidth='4'
          />
          <path
            className='opacity-75'
            fill='currentColor'
            d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
          />
        </svg>
      )}
      {leftIcon && <span className='mr-2'>{leftIcon}</span>}
      {children}
      {rightIcon && <span className='ml-2'>{rightIcon}</span>}
    </button>
  )
}

export default Button
