import type React from 'react'
import { createContext, useContext, useEffect, useRef, useState } from 'react'

interface IModalContextProps {
  openModal: () => void
  closeModal: () => void
  modalProps: IModalProps
  setModalProps: React.Dispatch<React.SetStateAction<IModalProps>>
  dialogRef?: React.RefObject<HTMLDialogElement | null>
}

const ModalContext = createContext<IModalContextProps | undefined>(undefined)

interface IModalContextProviderProps {
  children: React.ReactNode
}
export type CloseByOptions = 'any' | 'closerequest' | 'none'

interface IModalProps {
  type: string
  title: string
  closedby: CloseByOptions
  extra?: object
}

const blankModal: IModalProps = {
  title: 'title goes here',
  type: 'blank',
  closedby: 'any',
  extra: {},
}
const ModalContextProvider: React.FC<IModalContextProviderProps> = ({
  children,
}) => {
  const [modalProps, setModalProps] = useState<IModalProps>(blankModal)

  const dialogRef = useRef<HTMLDialogElement>(null)

  // Dealing with browsers that have not implemented closedby
  useEffect(() => {
    const el = dialogRef.current
    if (!el) return

    if ('closedby' in el) return
    const onClick = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const inside =
        e.clientX >= r.left &&
        e.clientX <= r.right &&
        e.clientY >= r.top &&
        e.clientY <= r.bottom
      if (!inside) el.close()
    }
    el.addEventListener('click', onClick)

    return () => {
      el.removeEventListener('click', onClick)
    }
  }, [])

  const openModal = () => {
    if (!dialogRef.current) {
      throw new Error('dialog missing')
    }
    dialogRef.current.showModal()
  }

  const closeModal = () => {
    if (!dialogRef.current) {
      throw new Error('dialog missing')
    }
    setModalProps(blankModal)
    dialogRef.current.close()
  }

  return (
    <ModalContext.Provider
      value={{
        openModal,
        closeModal,
        modalProps,
        setModalProps,
        dialogRef,
      }}
    >
      {children}
    </ModalContext.Provider>
  )
}

const useModalContext = (): IModalContextProps => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModalContext must be used within ModalContext')
  }
  return context
}

// eslint-disable-next-line react-refresh/only-export-components
export { ModalContextProvider, useModalContext }
