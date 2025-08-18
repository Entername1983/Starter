import CephCircle from '@assets/CephCircle.png'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <main className='p-2 bg-white dark:bg-blue-950 flex flex-col grow '>
      <h1 className='text-center mt-10'>Welcome Home!</h1>
      <section className='flex flex-col grow items-center justify-center gap-4'>
        <img src={CephCircle} className='max-h-[800px]' alt='Welcome' />
        <h3>Status: in Progress</h3>
      </section>
    </main>
  )
}
