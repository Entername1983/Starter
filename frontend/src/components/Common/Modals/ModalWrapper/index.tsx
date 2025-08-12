import { useModalContext } from '@contexts/ModalContext'
import type React from 'react'

import { LoginModalContent } from '../ModalsContent/LoginModalContent'
import { NotificationModalContent } from '../ModalsContent/NotificationModalContent'

// Using new HTML dialog element https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog
// closedby = "none" Only closable using a specific provided mechanism, which in this case is pressing the "Close" button below.
// closedby = "closerequest" Closable using the "Close" button or the Esc key.
// closedby = "any" Closable using the "Close" button, the Esc key, or by clicking outside the dialog. "Light dismiss" behavior.
// closedby is still unsupported on safary so we want to make sure to always include a close button
const ModalWrapper: React.FC = () => {
  const { closeModal, modalProps, dialogRef } = useModalContext()
  const closedBy = modalProps.closedby

  return (
    <dialog
      ref={dialogRef}
      // eslint-disable-next-line react/no-unknown-property
      closedby={closedBy}
      className={`mx-auto my-auto  rounded-xl p-2  `}
    >
      <div className={` flex flex-col h-80 w-140 `}>
        <div className='flex justify-between px-2'>
          <h3>{modalProps.title}</h3>
          <button className='cursor-pointer' onClick={closeModal}>
            X
          </button>
        </div>

        <div className=' flex-1 rounded-xl '>
          {(() => {
            switch (modalProps.type) {
              case 'login':
                return <LoginModalContent />
              case 'notification':
                return (
                  <NotificationModalContent
                    notificationOptions={modalProps.extra}
                  />
                )
              default:
                return <div>Unknown modal type</div>
            }
          })()}
        </div>
      </div>
    </dialog>
  )
}

export default ModalWrapper
