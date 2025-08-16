import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/RecoverPassword/')({
  component: RouteComponent,
})

//TODO: Implement password recovery

function RouteComponent() {
  return (
    <main className='p-4'>
      <header>
        <h1 className='text-4xl'>RECOVER PASSWORD</h1>
      </header>
      <section>NOT YET IMPLEMENTED</section>
    </main>
  )
}
