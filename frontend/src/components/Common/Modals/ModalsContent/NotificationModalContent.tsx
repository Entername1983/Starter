import {
  isNotificationOptions,
  type INotificationOptions,
} from '@hooks/useNotificationModal'
import type React from 'react'

interface NotificationModalContentProps {
  notificationOptions?: INotificationOptions | object | undefined
}

const NotificationModalContent: React.FC<NotificationModalContentProps> = ({
  notificationOptions,
}) => {
  if (!isNotificationOptions(notificationOptions))
    return <div>Error displaying content</div>

  const getIcon = () => {
    switch (notificationOptions.type) {
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
    switch (notificationOptions.type) {
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
    switch (notificationOptions.type) {
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

  return (
    <div className={`border-4 rounded-xl h-full ${getBorderColor()}`}>
      <div className='p-2 flex text-center gap-2 text-2xl'>
        <div className={` ${getIconColor()}`}>{getIcon()}</div>
        <h3>{notificationOptions.title}</h3>
      </div>
      <div className='p-3'>
        <p> {notificationOptions.message}</p>
      </div>
    </div>
  )
}

export { NotificationModalContent }
