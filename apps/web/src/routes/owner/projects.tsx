import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/owner/projects')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/owner/projects"!</div>
}
