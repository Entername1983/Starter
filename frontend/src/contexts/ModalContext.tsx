import type React from 'react'
import { createContext, useContext, useState, type ReactNode } from 'react'

interface IModalContextProps {
  isModalOpen: boolean
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  setModalContent: React.Dispatch<React.SetStateAction<ReactNode>>
  modalContent: ReactNode | null
}

const ModalContext = createContext<IModalContextProps | undefined>(undefined)

interface IModalContextProviderProps {
  children: React.ReactNode
}

const ModalContextProvider: React.FC<IModalContextProviderProps> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState<ReactNode | null>(null)

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        setIsModalOpen,
        setModalContent,
        modalContent,
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
