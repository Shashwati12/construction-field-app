import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/accountant")({
  beforeLoad: async () => {
    const res = await fetch("/auth/me", {
  credentials: "include",
})
    if(!res.ok){
      throw redirect({to: "/login"})
    }
    const data = await res.json()
    if (!data?.user?.role) {
  throw redirect({ to: "/login" })
}
    if(data.user.role !== "ACCOUNTANT"){
      throw redirect({to: "/login"})
    }
    return data.user
  },
  component: AccountantLayout,
})

function AccountantLayout(){
  return (
    <div>
      <h2>Accountant Area</h2>
      <Outlet />
    </div>
  )
}