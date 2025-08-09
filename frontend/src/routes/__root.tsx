import { Sidebar } from '@components/Common/Sidebar/Sidebar'
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Navbar } from '../components/Common/Navbar/navbar'

export const Route = createRootRoute({
  component: () => (
    <>
      <div className='p-2 flex gap-2'>
        <Navbar />
      </div>
      <div className='flex'>
        <Sidebar />
        <div className='w-full'>
          <hr />
          <Outlet />
          <TanStackRouterDevtools initialIsOpen={false} />
        </div>
      </div>
    </>
  ),
})
