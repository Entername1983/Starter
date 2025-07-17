import type React from 'react'

interface IModalWrapperProps {
  isOpen: boolean
  onClose: () => void
  title: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closable?: boolean
  children: React.ReactNode
}

const ModalWrapper: React.FC<IModalWrapperProps> = ({
  isOpen,
  onClose,
  title,
  size,
  closable,
  children,
}) => {
  size ??= 'md'
  return (
    <dialog open={isOpen} onClose={onClose} className={`modal modal-${size}`}>
      <h2>{title}</h2>
      {closable && <button onClick={onClose}>Close</button>}
      <div>{children}</div>
      <p>lalalala</p>
    </dialog>
  )
}

export default ModalWrapper
