import Button from '@components/Common/Button'
import type React from 'react'

interface INotificationModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  confirmText?: string
  onConfirm?: () => void
  showCancel?: boolean
}

const NotificationModal: React.FC<INotificationModalProps> = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  confirmText = 'OK',
  onConfirm,
  showCancel = false,
}) => {
  if (!isOpen) return null

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅'
      case 'error':
        return '❌'
      case 'warning':
        return '⚠️'
      case 'info':
        return 'ℹ️'
      default:
        return 'ℹ️'
    }
  }

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-500'
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'info':
        return 'text-blue-500'
      default:
        return 'text-blue-500'
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-green-200 dark:border-green-800'
      case 'error':
        return 'border-red-200 dark:border-red-800'
      case 'warning':
        return 'border-yellow-200 dark:border-yellow-800'
      case 'info':
        return 'border-blue-200 dark:border-blue-800'
      default:
        return 'border-blue-200 dark:border-blue-800'
    }
  }

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      onClose()
    }
  }

  return (
    <div className='fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50'>
      <div
        className={`bg-white dark:bg-neutral-800 rounded-2xl max-w-md w-full mx-4 shadow-2xl border-2 ${getBorderColor()}`}
      >
        <div className='p-6'>
          <div className='text-center'>
            <div className={`text-4xl mb-4 ${getIconColor()}`}>{getIcon()}</div>
            <h3 className='text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2'>
              {title}
            </h3>
            <p className='text-neutral-600 dark:text-neutral-400 mb-6'>
              {message}
            </p>
            <div className='flex gap-3'>
              {showCancel && (
                <Button variant='secondary' onClick={onClose} fullWidth>
                  Cancel
                </Button>
              )}
              <Button
                variant='primary'
                onClick={handleConfirm}
                fullWidth={!showCancel}
              >
                {confirmText}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationModal
