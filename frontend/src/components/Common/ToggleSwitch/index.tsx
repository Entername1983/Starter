import type React from 'react'

interface ToggleSwitchProps {
  isToggled: boolean
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  className?: string
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  isToggled,
  size = 'md',
  disabled = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-4',
    md: 'w-10 h-5',
    lg: 'w-12 h-6',
  }

  const knobSizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  }

  const translateClasses = {
    sm: isToggled ? 'translate-x-4' : 'translate-x-0.5',
    md: isToggled ? 'translate-x-5' : 'translate-x-0.5',
    lg: isToggled ? 'translate-x-6' : 'translate-x-0.5',
  }

  return (
    <div
      className={`
        ${sizeClasses[size]}
        relative inline-flex items-center rounded-full transition-colors duration-200 ease-in-out
        ${
          isToggled
            ? 'bg-blue-600 dark:bg-blue-500'
            : 'bg-gray-300 dark:bg-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
    >
      <div
        className={`
          ${knobSizeClasses[size]}
          ${translateClasses[size]}
          bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out
        `}
      />
    </div>
  )
}

export default ToggleSwitch
