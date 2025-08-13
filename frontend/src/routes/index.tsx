import { createFileRoute } from '@tanstack/react-router'
import CephCircle from '@assets/CephCircle.png'

export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <main className='p-2 bg-white dark:bg-blue-950 flex flex-col grow '>
      <h1 className='text-center mt-10'>Welcome Home!</h1>
      <section className='flex grow items-center justify-center'>
        <img src={CephCircle} className='max-h-[800px]' alt='Welcome' />
      </section>
    </main>
  )
}