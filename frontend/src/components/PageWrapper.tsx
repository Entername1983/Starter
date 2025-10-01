import { type ReactNode } from 'react'

interface IPageWrapperProps {
  children: ReactNode
}
const PageWrapper = ({ children }: IPageWrapperProps) => {
  return (
    <main className='mx-auto max-w-[1200px] px-2 pt-4 md:pt-10'>
      {children}
    </main>
  )
}

export { PageWrapper }
