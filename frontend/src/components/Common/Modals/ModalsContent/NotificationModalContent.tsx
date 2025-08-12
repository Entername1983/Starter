import type { INotificationOptions } from '@hooks/useNotificationModal'
import type React from 'react'

interface NotificationModalContentProps {
  notificationOptions: INotificationOptions
}

const NotificationModalContent: React.FC<NotificationModalContentProps> = ({
  notificationOptions,
}) => {
  return (
    <div>
      {notificationOptions.title}
      {notificationOptions.type}
      {notificationOptions.message}
    </div>
  )
}

export { NotificationModalContent }
