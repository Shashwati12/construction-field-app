import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/owner/dashboard")({
  component: OwnerDashboard,
})

function OwnerDashboard() {
  async function handleLogout() {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    window.location.href = "/login"
  }

  return (
    <div>
      <h1>OWNER Dashboard</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}
