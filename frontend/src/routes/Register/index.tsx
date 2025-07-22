import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Register/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello Register!</div>
}
