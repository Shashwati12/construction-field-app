import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/owner/_layout")({
  beforeLoad: async () => {
    const res = await fetch("/auth/me", {
      credentials: "include",
    })

    if (!res.ok) {
      throw redirect({ to: "/login" })
    }

    const data = await res.json()

    if (data.user.role !== "OWNER") {
      throw redirect({ to: "/login" })
    }

    return data.user
  },
  component: OwnerLayout,
})

function OwnerLayout() {
  async function handleLogout() {
    await fetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    })
    window.location.href = "/login"
  }

  return (
    <div>
      <h2>Owner Area</h2>
      <button onClick={handleLogout}>Logout</button>
      <Outlet />
    </div>
  )
}
