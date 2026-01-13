import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/accountant/dashboard")({
  component: () => <h1>ACCOUNTANT Dashboard</h1>,
})
