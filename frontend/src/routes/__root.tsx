import { Navbar } from '@components/Layout/Navbar'
import { Sidebar } from '@components/Layout/Sidebar'
import ModalWrapper from '@components/Modals/ModalWrapper'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

const ENVIRONMENT = import.meta.env.VITE_ENV
export const Route = createRootRoute({
  component: () => (
    <div className='bg-white dark:bg-blue-950 text-black dark:text-white min-h-screen flex flex-col'>
      <Navbar />

      <div className='hidden md:flex flex-grow'>
        <Sidebar />
        <div className='flex-grow overflow-auto'>
          <Outlet />
          {ENVIRONMENT === 'development' && (
            <TanStackRouterDevtools initialIsOpen={false} />
          )}
        </div>
      </div>

      <div className='md:hidden flex flex-col flex-grow'>
        <div className='flex-grow overflow-auto pb-16'>
          <Outlet />
          {ENVIRONMENT === 'development' && (
            <TanStackRouterDevtools initialIsOpen={false} />
          )}
        </div>
        <Sidebar />
      </div>

      <ModalWrapper />
    </div>
  ),
})
