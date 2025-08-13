import ModalWrapper from '@components/Common/Modals/ModalWrapper'
import { Sidebar } from '@components/Common/Sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Navbar } from '../components/Common/Navbar'
const ENVIRONMENT = import.meta.env.VITE_ENV
export const Route = createRootRoute({
  component: () => (
    <div className='bg-white dark:bg-blue-950 text-black dark:text-white min-h-screen'>
      <div>
        <Navbar />
      </div>
      <div className='flex border-2 border-amber-500'>
        <div className='border-2 border-red-800 '>
          <Sidebar />
        </div>
        <div className='border-2  flex grow border-green-800'>
          <hr />
          <Outlet />
          {ENVIRONMENT === 'development' && (
            <TanStackRouterDevtools initialIsOpen={false} />
          )}
        </div>
      </div>
      <ModalWrapper />
    </div>
  ),
})
