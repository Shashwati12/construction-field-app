import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/owner/reports')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/owner/reports"!</div>
}
