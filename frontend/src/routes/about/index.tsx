import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: About,
})

function About() {
  return (
    <main className='p-4'>
      <h1 className='text-4xl'>About Page</h1>
      <section className='my-8'>
        <p>Welcome to my starter template</p>
      </section>
    </main>
  )
}
