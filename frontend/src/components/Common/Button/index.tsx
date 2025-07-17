import type React from 'react'
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

const Button: React.FC<IButtonProps> = ({
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
}) => {
  const baseClasses =
    'cursor-pointer inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl border focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'

  const variantClasses = {
    primary:
      'bg-gradient-to-r from-primary-500 to-secondary-500 dark:from-primary-400 dark:to-secondary-400 dark:text-white border-transparent hover:from-primary-600 hover:to-secondary-600 dark:hover:from-primary-500 dark:hover:to-secondary-500  shadow-lg hover:shadow-xl focus:ring-primary-500',
    secondary:
      'bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-600 hover:bg-neutral-200 dark:hover:bg-neutral-600  focus:ring-neutral-500',
    dropdown:
      'w-full text-left border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200 hover:shadow-md focus:ring-primary-500',
    icon: 'p-3 text-neutral-500 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 border-transparent hover:scale-110 focus:ring-primary-500',
    randomize:
      'text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 hover:bg-neutral-50 dark:hover:bg-neutral-700  focus:ring-primary-500',
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
  }

  const widthClasses = fullWidth ? 'w-full' : ''

  const combinedClasses = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    widthClasses,
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={combinedClasses} disabled={disabled ?? loading} {...props}>
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
