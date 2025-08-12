import ModalWrapper from '@components/Common/Modals/ModalWrapper'
import { Sidebar } from '@components/Common/Sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Navbar } from '../components/Common/Navbar'

export const Route = createRootRoute({
  component: () => (
    <>
      <Navbar />

      <div className='flex'>
        <Sidebar />
        <div className='w-full'>
          <hr />
          <Outlet />
          <TanStackRouterDevtools initialIsOpen={false} />
        </div>
      </div>
      <ModalWrapper />
    </>
  ),
})
