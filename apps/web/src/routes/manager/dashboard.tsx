import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/manager/dashboard")({
  component: () => <h1>MANAGER Dashboard</h1>,
})
