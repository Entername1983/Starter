import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about/')({
  component: About,
})

function About() {
  return (
    <main className='p-2'>
      <h1>About Page</h1>

      <p>Hello from About!</p>
    </main>
  )
}
