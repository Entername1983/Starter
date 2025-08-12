import {
  useModalContext,
  type CloseByOptions,
  type IModalProps,
} from '@contexts/ModalContext'
type NotificationType = 'success' | 'error' | 'warning' | 'info'

interface INotificationOptions {
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
