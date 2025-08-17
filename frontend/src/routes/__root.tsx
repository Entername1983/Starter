import { Sidebar } from '@components/Common/Sidebar'
import ModalWrapper from '@components/Modals/ModalWrapper'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Navbar } from '../components/Common/Navbar'
const ENVIRONMENT = import.meta.env.VITE_ENV
export const Route = createRootRoute({
  component: () => (
    <div className='bg-white dark:bg-blue-950 text-black dark:text-white min-h-screen'>
      <Navbar />
      <div className='flex  min-h-screen'>
        <div className=''>
          <Sidebar />
        </div>
        <div className='flex grow  overflow-auto'>
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
