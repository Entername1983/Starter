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
      className="fixed inset-2 md:inset-4 md:mx-auto md:my-auto max-w-sm md:max-w-2xl w-auto h-auto max-h-[95vh] rounded-xl p-1 md:p-2 bg-white dark:bg-blue-800 text-black dark:text-white"
    >
      <div className="flex flex-col min-h-80 md:h-80 w-full">
        <div className='flex justify-between items-center px-2 py-2 border-b'>
          <h5 className='text-lg font-semibold'>{modalProps.title}</h5>
          <button 
            className='cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full w-8 h-8 flex items-center justify-center' 
            onClick={closeModal}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className='flex-1 rounded-xl overflow-y-auto p-1 md:p-2'>
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
