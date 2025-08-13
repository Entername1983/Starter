import { createFileRoute } from '@tanstack/react-router'
export const Route = createFileRoute('/')({
  component: Index,
})

function Index() {
  return (
    <main className='p-2 bg-white dark:bg-blue-950 '>
      <h1>Welcome Home!</h1>
    </main>
  )
}
