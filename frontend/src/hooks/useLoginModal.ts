import { useModalContext } from '@contexts/ModalContext'
interface ILoginModalProps {
  openLoginModal: () => void
  closeLoginModal: () => void
}

const useLoginModal = (): ILoginModalProps => {
  const { openModal, closeModal, setModalProps } = useModalContext()

  const openLoginModal = () => {
    setModalProps({ type: 'login', title: 'Login', closedby: 'any' })
    openModal()
  }

  const closeLoginModal = () => {
    closeModal()
    setModalProps({ type: 'blank', title: 'title goes here', closedby: 'any' })
  }

  return {
    openLoginModal,
    closeLoginModal,
  }
}

export default useLoginModal
