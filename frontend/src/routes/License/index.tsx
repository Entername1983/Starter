import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/License/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <main className='p-4'>
      <h1 className='text-4xl'>Readme</h1>
      <section className='my-6'>
        <h3 className='mb-4 text-2xl'>Starter Template Repo ReadMe</h3>
      </section>
    </main>
  )
}
