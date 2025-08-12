import {
  useModalContext,
  type CloseByOptions,
  type IModalProps,
} from '@contexts/ModalContext'
type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface INotificationOptions {
  type: NotificationType
  title: string
  message: string
  confirmText?: string
  onConfirm?: () => void
  showCancel?: boolean
  closedby: CloseByOptions
}

interface INotificationModalProps {
  setAndOpenNotificationsModal: (
    notificationOptions: INotificationOptions
  ) => void
  closeModal: () => void
  modalProps: IModalProps
}

export const isNotificationType = (
  value: unknown
): value is NotificationType => {
  return (
    typeof value === 'string' &&
    ['success', 'error', 'warning', 'info'].includes(value)
  )
}

export const isCloseByOptions = (value: unknown): value is CloseByOptions => {
  return (
    typeof value === 'string' && ['any', 'closerequest', 'none'].includes(value)
  )
}

export const isNotificationOptions = (
  value: unknown
): value is INotificationOptions => {
  if (!value || typeof value !== 'object') {
    return false
  }

  const obj = value as Record<string, unknown>

  if (!isNotificationType(obj['type'])) return false
  if (typeof obj['title'] !== 'string') return false
  if (typeof obj['message'] !== 'string') return false
  if (!isCloseByOptions(obj['closedby'])) return false

  if (
    obj['confirmText'] !== undefined &&
    typeof obj['confirmText'] !== 'string'
  ) {
    return false
  }

  if (
    obj['onConfirm'] !== undefined &&
    typeof obj['onConfirm'] !== 'function'
  ) {
    return false
  }

  if (
    obj['showCancel'] !== undefined &&
    typeof obj['showCancel'] !== 'boolean'
  ) {
    return false
  }

  return true
}

const useNotificationModal = (): INotificationModalProps => {
  const { openModal, closeModal, modalProps, setModalProps } = useModalContext()

  const setAndOpenNotificationsModal = (
    notificationOptions: INotificationOptions
  ) => {
    const notificationProps = {
      type: 'notification',
      title: notificationOptions.title,
      closedby: notificationOptions.closedby,
      extra: {
        type: notificationOptions.type,
        title: notificationOptions.title,
        message: notificationOptions.message,
        confirmText: notificationOptions.confirmText,
        onConfirm: notificationOptions.onConfirm,
        showCancel: notificationOptions.showCancel,
        closedby: notificationOptions.closedby,
      },
    }

    setModalProps(notificationProps)
    openModal()
  }

  return {
    setAndOpenNotificationsModal,
    closeModal,
    modalProps,
  }
}

export default useNotificationModal
